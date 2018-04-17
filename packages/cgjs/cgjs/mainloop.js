(counter => {
  /*! (c) 2017 Andrea Giammarchi - @WebReflection (ISC) */
  const mainloop = imports.mainloop;
  const holder = imports.gi.GLib.MainLoop.new(null, false);
  const IDLE = imports.cgjs.constants.IDLE;

  const id = mainloop.timeout_add(IDLE, () => {
    if (0 < counter) return true;
    if (holder.is_running()) holder.quit();
    return false;
  });

  this.run = () => {
    if (!holder.is_running() && 0 < counter) holder.run();
  };
  this.quit = () => {
    if (holder.is_running()) holder.quit();
    mainloop.source_remove(id);
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

})(0);
