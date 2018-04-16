const GLib = imports.gi.GLib;
const trim = ''.trim;
module.exports = o_O => trim.call(GLib.spawn_command_line_sync(o_O)[1]);
