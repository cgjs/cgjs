module.exports = new Proxy(
  Object.create(null),
  {
    get(target, name) {
      return target[name] ||
            (target[name] = imports.cgjs.camel.patch(name));
    }
  }
);