const path = require('../index');

console.assert(path.basename('/foo/bar/baz/asdf/quux.html') === 'quux.html', 'without ext');
console.assert(path.basename('/foo/bar/baz/asdf/quux.html', '.html') === 'quux', 'with ext');

console.assert(path.dirname('/foo/bar/baz/asdf/quux') === '/foo/bar/baz/asdf', 'correct dir name');

console.assert(path.extname('index.html') === '.html', 'simple ext');
console.assert(path.extname('index.coffee.md') === '.md', 'multi ext');
console.assert(path.extname('index.') === '.', 'suffix ext');
console.assert(path.extname('index') === '', 'no ext');
console.assert(path.extname('.index') === '', 'prefix ext');

console.assert(path.format({
  root: '/ignored',
  dir: '/home/user/dir',
  base: 'file.txt'
}) === '/home/user/dir/file.txt', 'format');

console.assert(path.format({
  root: '/',
  base: 'file.txt',
  ext: 'ignored'
}) === '/file.txt', 'format reduced');

console.assert(path.isAbsolute('/foo/bar'), 'absolute');
console.assert(!path.isAbsolute('qux/'), 'not absolute');

console.assert(path.join('/foo', 'bar', 'baz/asdf', 'quux', '..') === '/foo/bar/baz/asdf', 'join');

console.assert(path.normalize('/foo/bar//baz/asdf/quux/..') === '/foo/bar/baz/asdf', 'normalize');

console.assert(JSON.stringify(path.parse('/home/user/dir/file.txt')) === '{"root":"/","dir":"/home/user/dir","base":"file.txt","ext":".txt","name":"file"}', 'parse');

console.assert(path.relative('/data/orandea/test/aaa', '/data/orandea/impl/bbb') === '../../impl/bbb', 'relative');

console.assert(path.resolve('/foo/bar', './baz') === '/foo/bar/baz');
console.assert(path.resolve('/foo/bar', '/tmp/file/') === '/tmp/file');
