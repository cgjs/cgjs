# cgjs [![License: ISC](https://img.shields.io/badge/License-ISC-yellow.svg)](https://opensource.org/licenses/ISC)

A CommonJS Runtime for GJS

### Features

Differently from [jsgtk](https://github.com/WebReflection/jsgtk), this project has the following goals and features:

  * 100% based on GJS. No wrapping, no runtime transpilation, pure ECMAScript 2015+ via SpiderMonkey 52+
  * Gtk _camelCase_ methods are provided only on demand and if needed. You are free to `require('Gtk')`, which will add _camelCase_ method, or just regular GJS `imports.gi.Gtk`, suggested to develop core modules too.
  * by default, the core brings in only most basic features to develop CommonJS modules for GJS:
    * a `global` reference to the shared global GJS object
    * globally available timers such `setImmediate(fn, ...args)`, `setInterval(fn, delay, ...args)`, `setTimeout(fn, delay, ...args)` with also their `clearImmediate/Interval/Timeout(id)` counter functions
    * a spec compliant `require` function with `require.cache` and a `require.resolve` implemented via the [proper algorithm](https://nodejs.org/api/modules.html#modules_all_together)
  * all other core modules will be made available as soon as available
  * each core module is developed a part:
    * easier to maintain
    * easier to update
    * easier to track changes
    * easier to also contribute 🎉

### Core Installation

You need both [npm](https://www.npmjs.com) and [gjs](https://wiki.gnome.org/Projects/Gjs) available on your system.

Once you have both, you can install `cgjs` either locally, and use it via `npx cgjs`, or globally.

```sh
# global install example
npm install -g cgjs

# see default options
cgjs --help
```

### CommonJS Modules

By default, `cgjs` includes few core modules, and following you can check their current status:

  - [x] [assert](https://nodejs.org/api/assert.html) module as [@cgjs/assert](https://github.com/cgjs/assert)
  - [x] [buffer](https://nodejs.org/api/buffer.html) module as [@cgjs/buffer](https://github.com/cgjs/buffer)
  - [ ] [child_process](https://nodejs.org/api/child_process.html) module as [@cgjs/child_process](https://github.com/cgjs/child_process)
  - [x] [cluster](https://nodejs.org/api/cluster.html) module as [@cgjs/cluster](https://github.com/cgjs/cluster)
  - [x] [console](https://nodejs.org/api/console.html) module as [@cgjs/console](https://github.com/cgjs/console)
  - [ ] [crypto](https://nodejs.org/api/crypto.html) module as [@cgjs/crypto](https://github.com/cgjs/crypto)
  - [ ] [dns](https://nodejs.org/api/dns.html) module as [@cgjs/dns](https://github.com/cgjs/dns)
  - [x] [events](https://nodejs.org/api/events.html) module as [@cgjs/events](https://github.com/cgjs/events)
  - [x] [fs](https://nodejs.org/api/fs.html) module as [@cgjs/fs](https://github.com/cgjs/fs)
  - [ ] [http](https://nodejs.org/api/http.html) module as [@cgjs/http](https://github.com/cgjs/http)
  - [ ] [http2](https://nodejs.org/api/http2.html) module as [@cgjs/http2](https://github.com/cgjs/http2)
  - [ ] [https](https://nodejs.org/api/https.html) module as [@cgjs/https](https://github.com/cgjs/https)
  - [ ] [module](https://nodejs.org/api/module.html) module as [@cgjs/module](https://github.com/cgjs/module)
  - [ ] [net](https://nodejs.org/api/net.html) module as [@cgjs/net](https://github.com/cgjs/net)
  - [x] [os](https://nodejs.org/api/os.html) module as [@cgjs/os](https://github.com/cgjs/os)
  - [x] [path](https://nodejs.org/api/path.html) module as [@cgjs/path](https://github.com/cgjs/path)
  - [x] [process](https://nodejs.org/api/process.html) module as [@cgjs/process](https://github.com/cgjs/process)
  - [ ] [querystring](https://nodejs.org/api/querystring.html) module as [@cgjs/querystring](https://github.com/cgjs/querystring)
  - [ ] [readline](https://nodejs.org/api/readline.html) module as [@cgjs/readline](https://github.com/cgjs/readline)
  - [ ] [repl](https://nodejs.org/api/repl.html) module as [@cgjs/repl](https://github.com/cgjs/repl)
  - [ ] [stream](https://nodejs.org/api/stream.html) module as [@cgjs/stream](https://github.com/cgjs/stream)
  - [ ] [string_decoder](https://nodejs.org/api/string_decoder.html) module as [@cgjs/string_decoder](https://github.com/cgjs/string_decoder)
  - [x] [timers](https://nodejs.org/api/timers.html) module as [@cgjs/timers](https://github.com/cgjs/timers)
  - [ ] [tls](https://nodejs.org/api/tls.html) module as [@cgjs/tls](https://github.com/cgjs/tls)
  - [ ] [tty](https://nodejs.org/api/tty.html) module as [@cgjs/tty](https://github.com/cgjs/tty)
  - [ ] [dgram](https://nodejs.org/api/dgram.html) module as [@cgjs/dgram](https://github.com/cgjs/dgram)
  - [ ] [url](https://nodejs.org/api/url.html) module as [@cgjs/url](https://github.com/cgjs/url)
  - [x] [util](https://nodejs.org/api/util.html) module as [@cgjs/util](https://github.com/cgjs/util)
  - [ ] [vm](https://nodejs.org/api/vm.html) module as [@cgjs/vm](https://github.com/cgjs/vm)
  - [ ] [zlib](https://nodejs.org/api/zlib.html) module as [@cgjs/zlib](https://github.com/cgjs/zlib)


### Basic GJS info

You can install globally the [cgjs-about](https://github.com/cgjs/cgjs-about) utility and query it as described in the repository.

Together with `grep` it's a great way to have a quick overview of every namespace.
