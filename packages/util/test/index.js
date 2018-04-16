const util = require('../index');

console.log(
  util.inspect({
    n: 123,
    f: function () {},
    a: [1, '2', 3, null],
    o: {a: [1, {}, 3]}
  },
  {colors: true}
));

console.log(
  util.isDeepStrictEqual(
    {a: 123, b: [1, 2, 3]},
    {a: 123, b: [1, 2, 3]}
  )
);

function readAsync(name, cb) {
  setTimeout(cb, 100, null, `OK ${name}`);
}

util.promisify(readAsync)('test').then(console.log);
