/*! (c) 2017 Andrea Giammarchi - @WebReflection (ISC) */
Object.defineProperty(
  window,
  // require                        OK
  // require.cache                  OK
  // require.resolve                OK
  // require.resolve.paths(request) NOT IMPLEMENTED
  'require',
  {
    enumerable: true,
    value: (gi => {

      const GLib = gi.GLib;
      const Gio = gi.Gio;
      const File = Gio.File;
      const FileType = Gio.FileType;
      const FileQueryInfoFlags = Gio.FileQueryInfoFlags;

      const process = imports.cgjs.process;
      const {
        CORE_MODULES,
        DEBUG,
        GTK_MODULES
      } = imports.cgjs.constants;

      const isPath = /^[./\\]/;
      const cache = Object.create(null);

      const fileType = file => file.query_file_type(FileQueryInfoFlags.NONE, null);
      const createRequire = (base, parent) => {
        require.cache = cache;
        require.register = register;
        require.resolve = resolve.bind(null, base);
        function require(module) {
          const path = require.resolve(module);
          if (path in cache) return cache[path];
          if (path === module && !isPath.test(module)) {
            if (module in CORE_MODULES) {
              cache[module] = CORE_MODULES[module];
            }
            else if (GTK_MODULES.includes(module)) {
              cache[module] = imports.cgjs.camel.patch(module);
            }
            else {
              throw new Error(`${module} not found`);
            }
          } else {
            const content = File.new_for_path(path).load_contents(null)[1];
            if (path.slice(-5) === '.json') {
              cache[path] = JSON.parse(content);
            } else {
              const cjs = {
                exports: {},
                filename: path,
                loaded: false,
                parent: parent
              };
              const dirname = GLib.path_get_dirname(path);
              // avoid circular dependencies mess
              cache[path] = cjs.exports;
              Function(
                'exports',
                'module',
                'require',
                '__dirname',
                '__filename',
                content.toString().replace(/^#!.+[\r\n]+/, '')
              ).call(
                cjs.exports,
                cjs.exports,
                cjs,
                createRequire(dirname, cjs),
                dirname,
                path
              );
              cache[path] = cjs.exports;
              cjs.loaded = true;
            }
          }
          return cache[path];
        }
        return require;
      };

      // exposed through require but used to enrich
      // the default CommonJS modules environment
      function register(module, value) {
        if (module in CORE_MODULES && DEBUG) {
          print(`\u26A0\uFE0F ${module} already registered`);
        }
        CORE_MODULES[module] = value;
      }

      function resolve(base, module) {
        // https://nodejs.org/api/modules.html#modules_all_together
        let resolved;
        if (
          module in CORE_MODULES ||
          GTK_MODULES.includes(module)
        ) {
          resolved = module;
        } else {
          const dir = File.new_for_path(base);
          const resolver = isPath.test(module) ? loadAsFile : loadNodeModules;
          resolved = resolver(dir, module);
        }
        if (!resolved) throw new Error(`${module} not found`);
        return resolved;
      }

      function loadAsFile(dir, file) {
        let fd;
        if (['', '.js', '.json', '.node'].some(ext =>
          (fd = dir.resolve_relative_path(`${file}${ext}`)).query_exists(null)
        )) {
          switch (fileType(fd)) {
            case FileType.REGULAR:
              return fd.get_path();
            case FileType.DIRECTORY:
              return loadAsDirectory(dir.resolve_relative_path(file));
          }
        }
      }

      function loadAsDirectory(dir) {
        const pkg = dir.resolve_relative_path('package.json');
        if (
          pkg.query_exists(null) &&
          fileType(pkg) === FileType.REGULAR
        ) {
          const info = JSON.parse(pkg.load_contents(null)[1]);
          return info.main ? loadAsFile(dir, info.main) : loadIndex(dir);
        }
        return loadIndex(dir);
      }

      function loadIndex(dir) {
        let fd;
        if (
          ['index.js', 'index.json', 'index.node'].some(
            file => (fd = dir.resolve_relative_path(`${file}`)).query_exists(null)
          ) &&
          fileType(fd) === FileType.REGULAR
        ) return fd.get_path();
      }

      function loadNodeModules(dir, module) {
        let path;
        do {
          const modules = dir.resolve_relative_path('node_modules');
          if (modules.query_exists(null)) {
            path = loadAsFile(modules, module) || loadAsDirectory(modules);
            if (path) return path;
          }
        } while(dir.has_parent(null) && (dir = dir.get_parent()));
        process.env.NODE_PATH.split(':').some(folder => {
          if (folder.length) {
            dir = File.new_for_path(folder);
            path = loadAsFile(dir, module) || loadAsDirectory(dir);
            return true;
          }
        });
        return path;
      }

      return createRequire(process.cwd(), null);

    })(imports.gi)
  }
);
