/*
  ┌─────────────┐
  │ Differences │
  └─────────────┘
  debuglog(...) is a no-op (for now)
  deprecate(...) prints warnings, not errors
  format(...) uses GjsModule format (slightly different output)
  inspect(...) does not produce exact same output and has limited options
  isDeepStrictEqual(...) does not check all the things (for now)

  ┌─────────────┐
  │   Missing   │
  └─────────────┘
  TextDecoder
  TextEncoder
  ALL DEPRECATED METHODS

 */

this.callbackify = (p) => {
  return (err, ret) => {
    p.then(ret).catch(err);
  };
};

// NOOP for now
this.debuglog = () => () => {};

this.deprecate = (fn, message) => {
  let warn = true;
  return function () {
    if (warn) warn = (console.warn(message), false);
    return fn.apply(this, arguments);
  };
};

const format = imports.format;
this.format = (str, ...info) => format.vprintf(str, info);

// Note: this method is discouraged
//       and GJS supports standard class syntax
this.inherits = (constructor, super_) => {
  Object.setPrototypeOf(
    constructor.prototype,
    super_.prototype
  );
  Object.setPrototypeOf(constructor, super_).super_ = super_;
};

this.inspect = require('./src/inspect.js');

this.isDeepStrictEqual = require('./src/is-deep-strict-equal.js');

this.promisify = require('./src/promisify.js');
