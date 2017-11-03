# Contributing to CGJS

At this stage it's essential to bring in as many core modules as possible and in a "_close enough_" implementation.

The whole purpose of this project is to have somehow a working [npm](https://www.npmjs.com) ecosystem
and to achieve that there's no reason to have 100% NodeJS equivalent API.

Being GJS still focused on UI development, things strictly related to the network such `http2` or `https` modules might never be needed and it'd be great to prioritize most needed core modules.

As example, `process` needs also `os` and `stream` to work properly with its `stdio` and other streams: these should have priority.

However, every contribution to improve with tests or code any of the core module would be appreciated, and any _npm_ module that uses cgjs as executable would be awesomely welcomed too!

### Base Core Module Structure

You can check [timers](https://github.com/cgjs/timers), [console](https://github.com/cgjs/console), or [utils](https://github.com/cgjs/utils) core modules to have a quick view on how these are structured.

#### About Dependencies
 `cgjs` and eventually other core modules should never be a dependency but rather a **devDependecy**, as it is as example for [console](https://github.com/cgjs/console/blob/master/package.json#L30).

 In order to retrieve in a never ambiguous way your extra core module dependency, `cgjs` offers an utility through its core:

 ```js
 const coreModule = imports.cgjs.core.module(
   require,         // the module scoped require
   coreModuleName   // the module name to import
);

// as util example
const util = imports.cgjs.core.module(require, 'util');
```

The `imports.cgjs.core.module` utility is in charge of loading the right utility in production, falling back to the current module `devDependency` while developing.

This is needed to both avoid duplicated core modules and to make loading core modules easier from the possible `bin` folder used by either `npx` or global `npm`.

### Extra Core Utilities

Maybe useful to help developing core modules is the `imports.cgjs.constants` object or the `imports.cgjs.process`.

Constants are defined in [cg.js](https://github.com/cgjs/cgjs/blob/master/cg.js#L34) while `process` is a very essential
object with the following methods: `cwd()`, `argv()`, ed `env`.

These are equivalent to NodeJS `process.cwd()` , `process.argv()` and `process.env` and indeed used to populate `@cgjs/process` too.