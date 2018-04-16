/*

  ┌─────────────┐
  │   Missing   │
  └─────────────┘
  toNamespacedPath
  posix
  win32

 */


const GLib = imports.gi.GLib;
const File = imports.gi.Gio.File;
const {PATH_SEPARATOR} = imports.cgjs.constants;

this.basename = (path, ext = '') => GLib.path_get_basename(path).replace(ext, '');

this.delimiter = PATH_SEPARATOR === '/' ? ':' : ';';

this.dirname = path => GLib.path_get_dirname(path);

this.extname = path => {
  const base = GLib.path_get_basename(path);
  const i = base.lastIndexOf('.');
  return i <= 0 ? '' : base.slice(i);
};

this.format = path => this.join(
  path.dir || path.root,
  path.base || (path.name + path.ext)
);

this.isAbsolute = path => GLib.path_is_absolute(path);

this.join = (base, ...paths) =>
  paths.reduce(
    (base, path) => base.resolve_relative_path(path),
    File.new_for_path(base)
  ).get_path();

this.normalize = path => File.new_for_path(path).get_path();

this.parse = path => {
  const base = GLib.path_get_basename(path);
  const ext = this.extname(base);
  return {
    root: this.isAbsolute(path) ?
      path.slice(0, path.indexOf(PATH_SEPARATOR) + PATH_SEPARATOR.length) :
      '',
    dir: this.dirname(path),
    base,
    ext,
    name: ext.length ? base.slice(0, -ext.length) : base
  };
};

this.relative = (from, to) => {
  const sfrom = this.normalize(from).split(PATH_SEPARATOR);
  const sto = this.normalize(to).split(PATH_SEPARATOR);
  const length = sfrom.length;
  const out = [];
  let i = 0;
  while (i < length && sfrom[i] === sto[i]) i++;
  sto.splice(0, i);
  while (i++ < length) out.push('..');
  return out.concat(sto).join(PATH_SEPARATOR);
};

this.resolve = (...paths) => {
  const resolved = paths.length ? this.join(...paths) : '';
  return resolved || GLib.get_current_dir();
};

this.sep = PATH_SEPARATOR;
