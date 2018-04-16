const MODULE = require('../index');

function checkExistsSync() {
  const existingFiles = ['index.js', 'test', 'test/index.js'];
  const nonExistingFiles = ['asdasd', '/asdasd', ''];

  for (const file of existingFiles) {
    const result = MODULE.existsSync(file);
    if (result !== true) {
      throw new Error(`${file} exists but existsSync returned ${result}`);
    }
  }

  for (const file of nonExistingFiles) {
    const result = MODULE.existsSync(file);
    if (result !== false) {
      throw new Error(`${file} doesn't exists but existsSync returned ${result}`);
    }
  }
}

function checkReaddirSync() {
  const expectedFilesCount = 1;
  const expectedFileName = 'file.txt';

  const files = MODULE.readdirSync('./test/resources');

  if (files.length !== expectedFilesCount) {
    throw new Error(`readdirSync returned ${files.length} files instead of ${expectedFilesCount}`);
  }

  if (files[0] !== expectedFileName) {
    throw new Error(`Got file named ${files[0]} instead of ${expectedFileName}`);
  }
}

function checkReadFileSync() {
  const bufferData = MODULE.readFileSync('index.js');
  if (!(bufferData instanceof Buffer)) {
    throw new Error('readFileSync should return a Buffer if no encoding was specified');
  }

  const utf8Data = MODULE.readFileSync('./test/resources/file.txt', 'utf-8');
  if (!(typeof utf8Data === 'string')) {
    throw new Error('readFileSync should return a string when encoding is utf-8');
  }

  if (utf8Data.startsWith('Hello World')) {
    throw new Error('readFileSync returned a string but with the wrong value');
  }
}

if (!Object.keys(MODULE).length) {
  throw new Error('MODULE was not exported');
}

checkExistsSync();
checkReaddirSync();
checkReadFileSync();
