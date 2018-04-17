// basic module usage example
// if needed, you can access
// cgjs internals via GJS imports
const timers = imports.cgjs.timers;

// you can then do whatever you want to do
// and finally export the module regularly
module.exports = Object.assign({}, timers);
