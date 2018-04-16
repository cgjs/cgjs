const gi = imports.gi;
const GLib = gi.GLib;
const Gio = gi.Gio;
const mainloop = imports.cgjs.mainloop;
const EventEmitter = require('events').EventEmitter;

const cluster = {
  isMaster: !process.env._CGJS_WORKER,
  isWorker: !!process.env._CGJS_WORKER,
  workers: {},
  tmp: {},
  // FIXME callback isn't called
  disconnect(callback) { // eslint-disable-line no-unused-vars
    Object.keys(cluster.workers).forEach(id => {
      cluster.workers[id].disconnect();
    });
  },
  fork() {
    const tmp = GLib.file_open_tmp(null);
    const monitor = monitorFile(tmp[1], info => {
      if (info.hasOwnProperty('id')) {
        cluster.workers[info.id].emit('message', info.data);
      }
    });
    const closeTMP = () => {
      monitor.cancel();
      GLib.close(tmp);
    };
    const env = Object.assign(
      {_CGJS_WORKER: tmp[1]},
      process.env
    );
    const filename = module.parent.filename;
    const [
      ok, pid,
      // TODO stdin and stderr
      stdin, stdout, stderr // eslint-disable-line no-unused-vars
    ] = GLib.spawn_async_with_pipes(
      GLib.path_get_dirname(filename),
      [
        process.argv[0],
        filename
      ],
      Object.keys(env).map(key => `${key}=${env[key]}`),
      GLib.SpawnFlags.SEARCH_PATH,
      null
    );
    if (ok) {
      cluster.tmp[pid] = tmp;
      const worker = (cluster.workers[pid] =  new Worker(cluster, pid, tmp[1]));
      const reader = new Gio.DataInputStream({
        base_stream: new Gio.UnixInputStream({fd: stdout})
      });
      worker.reader = reader;
      worker.async = new Gio.Cancellable;
      const asyncRead = (self, result) => {
        if (worker.dead) return;
        else if (!worker.connected) {
          worker.connected = true;
          worker.emit('online');
        }
        const [out, size] = reader.read_line_finish_utf8(result);
        if (size) console.log(out.toString());
        reader.read_line_async(GLib.PRIORITY_DEFAULT, worker.async, asyncRead);
      };
      reader.read_line_async(GLib.PRIORITY_DEFAULT, worker.async, asyncRead);
      return worker.on('disconnect', closeTMP).on('exit', closeTMP);
    } else {
      closeTMP();
    }
  }
};

module.exports = cluster;

class Worker extends EventEmitter {
  constructor(cluster, id, tmp) {
    super();
    this.cluster = cluster;
    this.id = id;
    this.tmp = tmp;
    this.connected = false;
    this.dead = false;
    this.exitedAfterDisconnect = false;
    this.process = process;
    mainloop.wait();
  }
  disconnect() {
    destroy
      .call(this)
      .then(() => this.emit('disconnect'));
  }
  kill(signal) {
    destroy
      .call(this)
      .then(() => this.emit('exit', null, signal || 'SIGTERM'));
  }
  send(data) {
    if (this.connected) {
      sendInfo(this.tmp, {data: data});
    } else {
      this.once('online', () => this.send(data));
    }
  }
  isConnected() {
    return this.connected;
  }
  isDead() {
    return this.dead;
  }
}

if (cluster.isWorker) {
  process._monitor = monitorFile(process.env._CGJS_WORKER, info => {
    if (!info.hasOwnProperty('id')) {
      process.emit('message', info.data);
    }
  });
  process.send = (data) => sendInfo(
    process.env._CGJS_WORKER,
    {
      id: process.pid,
      data: data
    }
  );
}

function monitorFile(path, then) {
  const monitor = Gio.File.new_for_path(path).monitor_file(
    Gio.FileMonitorEvent.CHANGES_DONE_HINT, null
  );
  monitor.connect('changed', (monitor, file, other, event) => {
    if (event === Gio.FileMonitorEvent.CHANGES_DONE_HINT) {
      const info = JSON.parse(GLib.file_get_contents(path)[1].toString());
      then(info);
    }
  });
  return monitor;
}

function sendInfo(file, info) {
  GLib.file_set_contents(file, JSON.stringify(info));
}

function destroy() {
  if (this.dead) throw new Error('already dead');
  return new Promise(resolve => {
    delete this.cluster.workers[this.id];
    this.connected = false;
    this.dead = true;
    this.exitedAfterDisconnect = true;
    this.async.cancel();
    this.reader.clear_pending();
    this.reader.read_line_async(GLib.PRIORITY_DEFAULT, null, () => {
      this.reader.close(null);
      this.async = this.reader = null;
      mainloop.go();
      resolve();
    });
  });
}
