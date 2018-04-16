(() => {
  /*! (c) 2017 Andrea Giammarchi - @WebReflection (ISC) */
  const mainloop = imports.mainloop;
  const cgjsloop = imports.cgjs.mainloop;

  const ids = new Set();
  const clearID = (id) => {
    if (ids.has(id)) {
      ids.delete(id);
      cgjsloop.go();
      mainloop.source_remove(id);
    }
  };

  const createClearTimer = () => id => clearID(id);
  const createSetTimer = (repeat) =>
    (fn, ms, ...args) => {
      const id = mainloop.timeout_add(
        (ms * 1) || 0,
        () => {
          if (!repeat) clearID(id);
          fn.apply(null, args);
          return repeat;
        }
      );
      cgjsloop.wait();
      ids.add(id);
      return id;
    };

  this.clearImmediate = createClearTimer();
  this.clearInterval = createClearTimer();
  this.clearTimeout = createClearTimer();

  this.setImmediate = (fn, ...args) => {
    const id = cgjsloop.idle(fn, ...args);
    ids.add(id);
    return id;
  };
  this.setInterval = createSetTimer(true);
  this.setTimeout = createSetTimer(false);

})();
