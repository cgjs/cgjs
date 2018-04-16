const assert = require('../index');

const obj1 = {
  a: {
    b: 1
  }
};
const obj2 = {
  a: {
    b: 2
  }
};
const obj3 = {
  a: {
    b: 1
  }
};

assert.deepEqual(obj1, obj3);

let error;
try {
  assert.deepEqual(obj1, obj2);
} catch (err) {
  error = err;
}
assert(error);
