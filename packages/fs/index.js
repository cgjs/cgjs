const { Gio, GLib } = imports.gi;

const { Buffer } = require('buffer');

function getEncodingFromOptions(options, defaultEncoding = 'utf8') {
  if (options === null) {
    return defaultEncoding;
  }

  if (typeof options === 'string') {
    return options;
  }

  if (typeof options === 'object' && typeof options.encoding === 'string') {
    return options.encoding;
  }

  return defaultEncoding;
}

function existsSync(path) {
  // TODO: accept buffer and URL too
  if (typeof path !== 'string' || path === '') {
    return false;
  }

  const file = Gio.File.new_for_path(path);
  return file.query_exists(null);
}

function readdirSync(path, options = 'utf8') {
  const encoding = getEncodingFromOptions(options);
  const dir = Gio.File.new_for_path(path);
  const list = [];

  const enumerator = dir.enumerate_children('standard::*', 0, null);
  let info = enumerator.next_file(null);

  while (info) {
    const child = enumerator.get_child(info);
    const fileName = child.get_basename();

    if (encoding === 'buffer') {
      const encodedName = Buffer.from(fileName);
      list.push(encodedName);
    } else {
      const encodedName = Buffer.from(fileName).toString(encoding);
      list.push(encodedName);
    }

    info = enumerator.next_file(null);
  }

  return list;
}

function readFileSync(path, options = { encoding: null, flag: 'r' }) {
  const file = Gio.File.new_for_path(path);

  const [ok, data] = file.load_contents(null);

  if (!ok) {
    // TODO: throw a better error
    throw new Error('failed to read file');
  }

  const encoding = getEncodingFromOptions(options, 'buffer');
  if (encoding === 'buffer') {
    return Buffer.from(data);
  }

  return data.toString(encoding);
}

function mkdirSync(path, mode = 0o777) {
  if (GLib.mkdir_with_parents(path, mode) !== 0) {
    // TODO: throw a better error
    throw new Error(`failed to make ${path} directory`);
  }
}

function rmdirSync(path) {
  const result = GLib.rmdir(path);

  if (result !== 0) {
    // TODO: throw a better error
    throw new Error(`failed to remove ${path} directory`);
  }
}

function unlinkSync(path) {
  GLib.unlink(path);
}

function writeFileSync(path, data) {
  GLib.file_set_contents(path, data);
}

const FSWatcher = require('./fs-watcher');
function watch(filename, options, listener) {
  return new FSWatcher(filename, options, listener);
}

module.exports = {
  FSWatcher,
  existsSync,
  readdirSync,
  readFileSync,
  writeFileSync,
  mkdirSync,
  rmdirSync,
  unlinkSync,
  watch
};
