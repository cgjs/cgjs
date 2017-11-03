(timers => {
  /*! (c) 2017 Andrea Giammarchi - @WebReflection (ISC) */
  [
    {name: 'clearImmediate', value: timers.clearImmediate},
    {name: 'clearInterval', value: timers.clearInterval},
    {name: 'clearTimeout', value: timers.clearTimeout},
    {name: 'global', value: window},
    {name: 'setImmediate', value: timers.setImmediate},
    {name: 'setInterval', value: timers.setInterval},
    {name: 'setTimeout', value: timers.setTimeout}
  ].forEach(global => {
    if (global.name in window) return;
    Object.defineProperty(window, global.name, {
      enumerable: true,
      value: global.value
    });
  });
})(imports.cgjs.timers);
