const promisify = (original) => {
  return function (...args) {
    return new Promise((res, rej) => {
      args.push((err, ret) => {
        if (err) rej(err);
        else res(ret);
      });
      original.apply(this, args);
    });
  };
};

promisify.custom = Symbol('util.promisify');

module.exports = promisify;
