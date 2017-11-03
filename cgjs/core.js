(globalRequire => {
  /*! (c) 2017 Andrea Giammarchi - @WebReflection (ISC) */
  this.module = (require, module) => module in globalRequire.cache ?
      globalRequire(module) :
      require(`@cgjs/${name}`);

  const path = (dir, path) => dir.resolve_relative_path(path);
  [
    // WARNING: core modules order matters !!!
    {name: 'util', global: true},
    {name: 'console', global: true},
    // {name: 'process', global: true},
    // others might land soon in core too
    // {name: 'fs'},
    // {name: 'path'},
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
          break;
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
