/*
  This module is not really what GJS needs so only most basic
  functionalities are in place.

  ┌─────────────┐
  │ Differences │
  └─────────────┘
  strictEqual uses Object.is
  deep equal is not 1:1 node-reliable

  ┌─────────────┐
  │   Missing   │
  └─────────────┘
  all the notXXXX methods
  complex unnecessary assertions for GJS development

 */


const gPO = Object.getPrototypeOf;

const assert = (...args) => console.assert(...args);

assert.ok = console.assert;

assert.deepEqual = (actual, expected, message) => {
  if (!deepEqual(actual, expected, message, new WeakSet))
    throw new Error(message || 'deepEqual failed');
  return true;
};

assert.deepStrictEqual = assert.deepEqual;

assert.doesNotThrow = (block, error, message) => {
  try { block(); } catch(o_O) {
    throw message ? new Error(message) : o_O;
  }
};

assert.equal = (actual, expected, message) => {
  if (actual != expected) throw new Error(message || 'AsertionError');
};

assert.ifError = value => {
  if (value) throw value;
};

assert.strictEqual = (actual, expected, message) => {
  if (!Object.is(actual, expected))
    throw new Error(message || 'AssertionError: not strict equality');
};

module.exports = assert;


function deepEqual(actual, expected, message, set) {
  if (actual == expected) return true;
  switch (typeof actual) {
    case 'object':
      if(actual) break;
    case 'boolean':
    case 'number':
    case 'string':
    case 'symbol':
    case 'undefined':
      if (actual != expected) {
        throw new Error(message || 'deepEqual failed');
      }
      return true;
  }
  if (gPO(actual) !== gPO(expected)) {
    throw new Error(message || 'deepEqual failed');
  }
  if (!set.has(actual)) {
    set.add(actual);
    switch (true) {
      case actual instanceof Map:
      case actual instanceof Set:
        return actual.every((value, key) => {
          deepEqual(value, expected[key], message, set);
        });
      default:
        return Object.keys(actual).every(
          key => deepEqual(actual[key], expected[key], message, set)
        );
    }
  }
}
