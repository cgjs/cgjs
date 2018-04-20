(() => {
  /*! (c) 2017-2018 Andrea Giammarchi - @WebReflection (ISC) */
  const mainloop = imports.mainloop;
  const IDLE = imports.cgjs.constants.IDLE;

  let running = false;
  let counter = 0;

  this.run = () => {
    if (!running && 0 < counter) {
      running = true;
      mainloop.timeout_add(IDLE, () => {
        if (0 < counter) return true;
        this.quit();
      });
      mainloop.run();
    }
  };

  this.quit = () => {
    if (running) {
      running = false;
      mainloop.quit();
    }
  };

  this.go = () => --counter;
  this.wait = () => ++counter;

  this.idle = (fn, ...args) => {
    this.wait();
    return mainloop.idle_add(() => {
      this.go();
      fn.apply(null, args);
    });
  };

})();
