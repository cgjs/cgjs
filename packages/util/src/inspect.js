// this was quickly and slightly improved from JSGtk project
// it's not fully compatible with Node but ... hey ...

const YELLOW = '\x1b[0;33m';
const GREEN = '\x1b[0;32m';
const RESET = '\x1b[0m';
const MAGENTA = '\x1b[0;35m';
const RED = '\x1b[0;31m';
const BOLD = '\x1b[1m';
const CYAN = '\x1b[0;36m';
const GREY = '\x1b[0;90m';
// const BLUE = '\x1b[0;34m';

const colored = (what, color, how) => {
  return how.colors ? (color + what + RESET) : what;
};

const regExp = re => {
  const out = ['/', re.source, '/'];
  if (re.global) out.push('g');
  if (re.ignoreCase) out.push('i');
  if (re.multiline) out.push('m');
  if (re.unicode) out.push('u');
  if (re.sticky) out.push('y');
  return out.join('');
};

const inspectArray = (obj, tab, wm, how, d) => {
  let
    out = ['['],
    t = '  '.repeat(tab),
    primitive = false
  ;
  obj.forEach(value => {
    switch (typeof value) {
      case 'boolean':
      case 'number':
      case 'string':
        out.push(primitive ? ' ' : ('\n' + t), $inspect(value, tab, wm, how, d), ',');
        primitive = true;
        break;
      default:
        if (value == null) {
          out.push(primitive ? ' ' : ('\n' + t), $inspect(value, tab, wm, how, d), ',');
          primitive = true;
        } else {
          primitive = false;
          out.push('\n', t, $inspect(value, tab, wm, how, d), ',');
        }
        break;
    }
  });
  if (out.length > 1) {
    out.pop();
    out.push('\n', '  '.repeat(tab - 1), ']');
  } else {
    out.push(']');
  }
  return out.join('');
};

const inspectBuffer = (obj) => {
  let out = ['<Buffer'];
  for (let i = 0; i < obj.length; i++)
    out.push(obj[i].toString(16));
  return out.join(' ') + '>';
};

const inspectObject = (obj, tab, wm, how, d) => {
  let
    out = ['{'],
    t = '  '.repeat(tab),
    simple = /^[a-zA-Z$_]+[a-zA-Z0-9$_]*$/
  ;
  (how.showHidden ?
    Object.getOwnPropertyNames :
    Object.keys
  )(obj).forEach(key => {
    out.push('\n', t,
      simple.test(key) ?
        key : colored(JSON.stringify(key), GREEN, how),
      ': ',
      $inspect(obj[key], tab, wm, how, d),
    ',');
  });
  if (out.length > 1) {
    out.pop();
    out.push('\n', '  '.repeat(tab - 1), '}');
  } else {
    out.push('}');
  }
  return out.join('');
};

const $inspect = (obj, tab, wm, how, d) => {
  switch (typeof obj) {
    case 'boolean':
    case 'number':
      return colored(String(obj), YELLOW, how);
    case 'function':
      return wm.has(obj) ?
        colored('[Circular]', CYAN, how) :
        (wm.add(obj), colored(
          '[Function' + (
            obj.name ? (': ' + obj.name) : ''
          ) + ']', CYAN, how
        ));
    case 'object':
      switch (true) {
        case !obj: return colored('null', BOLD, how);
        case wm.has(obj): return colored('[Circular]', CYAN, how);
        default:
          wm.add(obj);
          switch (true) {
            case Array.isArray(obj):
              return d <= how.depth ?
                inspectArray(obj, tab + 1, wm, how, d + 1) :
                colored('[Array]', CYAN, how);
            case obj instanceof Uint8Array:
              return d <= how.depth ?
                inspectBuffer(obj, tab + 1, wm, how, d + 1) :
                colored('[Buffer]', CYAN, how);
            case obj instanceof RegExp:
              return colored(regExp(ob), RED, how);
            case obj instanceof Date:
              return colored(JSON.stringify(obj), MAGENTA, how);
            default:
              return d <= how.depth ?
                inspectObject(obj, tab + 1, wm, how, d + 1) :
                colored('[Object]', CYAN, how);
          }
          break;
      }
    case 'string':
      return colored(JSON.stringify(obj), GREEN, how);
    case 'symbol':
      return colored(String(obj), YELLOW, how);
    case 'undefined':
      return colored(String(obj), GREY, how);
  }
  return 'unknown';
};

const inspect = (object, options = {}) => {
  return $inspect(
    object,
    0,
    new WeakSet,
    Object.assign({}, inspect.defaultOptions, options),
    0
  );
};

inspect.defaultOptions = {
  showHidden: false,
  depth: 2,
  colors: false,
  customInspect: true,
  showProxy: false,
  maxArrayLength: 100,
  breakLength: 60
};

inspect.custom = Symbol('util.inspect');

module.exports = inspect;
