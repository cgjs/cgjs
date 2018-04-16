# @cgjs/process [![License: ISC](https://img.shields.io/badge/License-ISC-yellow.svg)](https://opensource.org/licenses/ISC)

process core module for [cgjs](https://github.com/cgjs/cgjs)

### Currently usable

  * `abort()`
  * `arch`, via `require('os').arch()`
  * `argv`
  * `argv0`
  * `cwd()`
  * `env`
  * `exit([code])`
  * `nexttick(callback[, ...args])`, via `setImmediate(...)`
  * `pid`, via `new Gio.Credentials().get_unix_pid()`. Not sure yet it works for macOS
  * `platform`, via `require('os').platform()`
  * `title`, via `GLib.get_prgname()`
  * `version`, via cgjs `package.json` version
  * `uptime`, via `Date.now() - START_TIME`
  * `versions()`, via cgjs `package.json` dependencies
