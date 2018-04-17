const timers = require('../index');

if (!Object.keys(timers).length) {
  throw new Error('timers are not exported');
}