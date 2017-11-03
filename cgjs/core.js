(() => {
  /*! (c) 2017 Andrea Giammarchi - @WebReflection (ISC) */
  [
    // console and process should have priority
    {name: 'console', global: true},
    // {name: 'process', global: true},
    // others might land soon in core too
    // {name: 'fs'},
    // {name: 'path'},
  ].forEach(
    function (module) {
      const path = ['@cgjs', module.name].reduce(
        (dir, path) => dir.resolve_relative_path(path),
        this.get_parent()
      ).get_path();
      require.register(module.name, require(path));
      if (module.global) {
        global[module.name] = require(module.name);
      }
    },
    imports.gi.Gio.File.new_for_path(
      imports.cgjs.constants.PROGRAM_DIR
    )
  );
})();
