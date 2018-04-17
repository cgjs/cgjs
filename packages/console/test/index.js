const console = global.console || require('../index');

setTimeout(console.clear, 1000);

console.time();
console.count();
console.count('default');
console.count('label');
console.log('');
console.log(1, 2, 3);
console.log('');
console.info('this should be logged');
console.warn('this should be logged');
console.trace('my trace');
console.timeEnd();

try {
  console.assert(false, 'this should be logged');
} catch(e) {
  console.error(e.message);
}
