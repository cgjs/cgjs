(globalRequire => {
  /*! (c) 2017 Andrea Giammarchi - @WebReflection (ISC) */
  this.module = (require, module) => module in globalRequire.cache ?
      globalRequire(module) :
      require(`@cgjs/${module}`);

  const path = (dir, path) => dir.resolve_relative_path(path);
  [
    // WARNING: core modules order matters !!!
    //          Modules without other core modules dependencies
    //          should be defined on top to be available to the rest of the core.
    {name: 'buffer'},
    {name: 'events'},
    {name: 'os'},
    {name: 'path'},
    {name: 'timers'},
    {name: 'util'},
    {name: 'console', global: true},
    {name: 'assert'},
    {name: 'fs'}
  ].forEach(
    function (module) {
      const included = ['node_modules', '@cgjs', module.name].reduce(path, this);
      const outside = ['@cgjs', module.name].reduce(path, this.get_parent());
      switch (true) {
        case included.query_exists(null):
          require.register(module.name, require(included.get_path()));
          break;
        case outside.query_exists(null):
          require.register(module.name, require(outside.get_path()));
          break;
        default:
          throw new Error(
            `unable to find ${module.name}
            ${included.get_path()}
            ${outside.get_path()}`
            .replace(/^\s+/gm, '')
          );
      }
      if (module.global) {
        global[module.name] = require(module.name);
      }
    },
    imports.gi.Gio.File.new_for_path(
      imports.cgjs.constants.PROGRAM_DIR
    )
  );

})(require);
