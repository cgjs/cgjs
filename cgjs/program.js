(gi => {
  /*! (c) 2017 Andrea Giammarchi - @WebReflection (ISC) */
  const process = imports.cgjs.process;
  if (
    // cgjs file.js
    process.argv.some((arg, i) => {
      if (
        i &&
        (arg[0] !== '-') &&
        (arg[i - 1][0] !== '-') &&
        gi.GLib.path_is_absolute(arg)
      ) {
        require(arg);
        return true;
      }
    }) ||
    // cgjs -e '1 + 2'
    ARGV.some((arg, i) => {
      if (i && /^-e|--eval$/.test(ARGV[i - 1])) {
        Function('require', '__dirname', '__filename', arg)
          .call(global, require, process.cwd(), '[eval]');
        return true;
      }
    })
  ) {
    imports.cgjs.mainloop.run();
  } else {
    const dir = gi.Gio.File.new_for_path(imports.cgjs.constants.PROGRAM_DIR);
    const info = require(dir.resolve_relative_path('package.json').get_path());
    switch (true) {
      case ARGV.some(arg => /^-v|--version$/.test(arg)):
        print(info.version);
        break;
      case ARGV.some(arg => /^-h|--help$/.test(arg)):
        const open = '\uD83C\uDF88', close = '\uD83C\uDF89';
        print(`
          \x1B[1m${info.name}\x1B[0m ${info.version} \x1B[2mby ${info.author.name || info.author}\x1B[0m

         \x1B[2m┌───────────────────────────────────┐\x1B[0m
         \x1B[2m│\x1B[0m ${open} ${info.description} ${close}  \x1B[2m│\x1B[0m
         \x1B[2m└───────────────────────────────────┘\x1B[0m

          usage:    cgjs program.js [options]
                    cgjs [options]

          options:  -d | --debug
                    -e | --eval 'some code'
                    -v | --version
                    -h | --help
        `.replace(/^        /gm, ''));
        break;
      default:
        print(`\x1B[1m${info.name}\x1B[0m ${info.version}`);
        imports.console.interact();
        break;
    }
  }
})(imports.gi);