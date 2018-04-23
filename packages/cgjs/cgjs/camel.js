(gi => {
  /*! (c) 2017 Andrea Giammarchi - @WebReflection (ISC) */
  const GIRepository = gi.GIRepository;
  const InfoType = GIRepository.InfoType;
  const rep = GIRepository.Repository.get_default();
  const patched = new Set;
  const python_case = /^[a-z]+(?:[_-][a-z]+)+$/;
  const test_ = /^test_/;
  const define = (where, name, value) =>
    Object.defineProperty(where, name, {configurable: true, value})[name];
  const camelize = name => name.replace(/_([a-z])/g, ($0, $1) => $1.toUpperCase());
  const lowerize = name => name.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
  const camelPatch = Namespace => {
    const facade = {};
    const descriptors = {};
    const Class = gi[Namespace];
    for (let i = 0, length = rep.get_n_infos(Namespace); i < length; i++) {
      const info = rep.get_info(Namespace, i);
      const name = info.get_name();
      switch(info.get_type()) {
        case InfoType.OBJECT:
          descriptors[name] = {
            configurable: true,
            get: () => define(facade, name, classPatch(Class[name]))
          };
          break;
        case InfoType.FUNCTION:
          if (!test_.test(name) && python_case.test(name)) {
            let value;
            try { value = Class[name]; } catch(o_O) {
              // nothing to do here
            }
            if (value) {
              define(Class, camelize(name), Class[name]);
              descriptors[camelize(name)] = {
                configurable: true,
                get: () => define(facade, name, Class[name])
              };
            }
          }
        default:
          descriptors[name] = {
            configurable: true,
            get: () => define(facade, name, Class[name])
          };
          break;
      }
    }
    return new Proxy(
      Object.defineProperties(facade, descriptors),
      {
        get(target, name) {
          return target.hasOwnProperty(name) ?
                  target[name] :
                  (target[name] = Class[name] || Class[lowerize(name)]);
        }
      }
    );
  };
  const classPatch = (Class) => {
    if (!patched.has(Class)) {
      patched.add(Class);
      const path = Class.name.split('_');
      if (path.length === 2) {
        const info = rep.find_by_name.apply(rep, path);
        if (info) {
          let proto = Class.prototype;
          for (let i = 0, l = GIRepository.object_info_get_n_methods(info); i < l; i++) {
            const method = GIRepository.object_info_get_method(info, i);
            const name = method.get_name();
            if (python_case.test(name)) {
              const value = proto[name] || Class[name];
              define(value === proto[name] ? proto : Class, camelize(name), value);
            }
          }
          proto = Object.getPrototypeOf(proto);
          if (proto) classPatch(proto.constructor);
        } 
      }
    }
    return Class;
  };
  this.patch = camelPatch;
})(imports.gi);