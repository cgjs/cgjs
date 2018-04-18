const process = global.process || require('../index');
const console = require('console');
const assert = require('assert');

process.on('exit', code => console.log('bye bye: ' + code));

Object.keys(process).forEach(key => {
  switch (key) {
    case 'abort':
    case 'env':
    case 'exit':
    case 'nextTick':
      return;
  }
  console.log(key, typeof process[key] === 'function' ? process[key]() : process[key]);
});

process.nextTick(process.exit, 0);

assert.deepEqual(process.argv.splice(2),  ["--foo", "bar"]);
