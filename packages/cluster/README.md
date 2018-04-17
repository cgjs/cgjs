# @cgjs/cluster [![License: ISC](https://img.shields.io/badge/License-ISC-yellow.svg)](https://opensource.org/licenses/ISC)

cluster core module for [cgjs](https://github.com/cgjs/cgjs)

### How doe it work ?

Basically the whole logic is based on `GLib.spawn_async_with_pipes` and a temporary file as communication channel.

Every worker will be a spawn of the file that forked it and for what I could test, this seems to work pretty well.
