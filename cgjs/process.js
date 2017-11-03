(gi => {
  /*! (c) 2017 Andrea Giammarchi - @WebReflection (ISC) */
  const GLib = gi.GLib;
  const File = gi.Gio.File;

  this.cwd = () => GLib.get_current_dir();

  const dir = File.new_for_path(this.cwd());
  this.argv = [
    imports.cgjs.constants.PROGRAM_EXE
  ].concat(ARGV.map((arg, i, all) =>
    arg[0] === '-' || (i && all[i - 1][0] === '-') ?
      arg :
      dir.resolve_relative_path(arg).get_path()
  ));

  this.env = GLib.listenv().reduce(
    (env, key) => {
      env[key] = GLib.getenv(key);
      return env;
    },
    {}
  );

})(imports.gi);
