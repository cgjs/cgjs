const system = require('./src/system.js');

const GLib = imports.gi.GLib;
const {PATH_SEPARATOR} = imports.cgjs.constants;
this.EOL = PATH_SEPARATOR === '/' ? '\n' : '\r\n';

const UNAME_ALL = system('uname -a');

this.arch = () => {
  switch (true) {
    case /\bx86_64\b/.test(UNAME_ALL): return 'x64';
    case /\bi686\b/.test(UNAME_ALL): return 'ia32';
    default: return 'arm';
  }
};

this.platform = () => {
  switch (true) {
    case /\bDarwin\b/i.test(UNAME_ALL): return 'darwin';
    case /\bLinux\b/i.test(UNAME_ALL): return 'linux';
    default: return 'win32';
  }
};

this.homedir = () => GLib.get_home_dir();

this.hostname = () => GLib.get_host_name();

this.release = () => system('uname -r');

this.tmpdir = () => GLib.get_tmp_dir();

this.type = () => system('uname');

this.userInfo = () => ({
  uid: 1000,
  gid: 100,
  username: GLib.get_user_name(),
  homedir: GLib.get_home_dir()
});

this.constants = require('./src/constants.js');

const extras = require(`./src/${this.platform()}.js`);

Object.keys(extras).forEach(key => this[key] = extras[key]);
