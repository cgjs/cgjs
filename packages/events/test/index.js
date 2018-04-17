const EventEmitter = require('../index');

const emitter = new EventEmitter;
let i = 0;

console.assert(emitter.once('test', () => i++).emit('test'), 'listeners, emit');
console.assert(!emitter.emit('test'), 'no listeners, no emit');
console.assert(i === 1, 'emitted once');

const events = [];
emitter.on('newListener', (...args) => events.push({type: 'newListener', args}));
emitter.on('removeListener', (...args) => events.push({type: 'removeListener', args}));
emitter.once('intercept', (...args) => events.push({type: 'event', args}));
emitter.emit('intercept', 1, 2, 3);

console.assert(JSON.stringify(events) === '[{"type":"newListener","args":["removeListener",null]},{"type":"newListener","args":["intercept",null]},{"type":"removeListener","args":["intercept",null]},{"type":"event","args":[1,2,3]}]', 'intercepted');
