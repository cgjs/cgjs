const createSubnet = require('./createSubnet');
const system = require('./system.js');
const EOL = /\r\n|\n/;

const getIPv4Subnet = createSubnet(32, 8, 10, '.');
const getIPv6Subnet = createSubnet(128, 16, 16, ':');

this.cpus = () => {
  const PROCESSOR = /^processor\s*:\s*(\d+)/i;
  const NAME = /^model[\s_]+name\s*:([^\r\n]+)/i;
  const FREQ = /^cpu[\s_]+MHz\s*:\s*(\d+)/i;
  const cpus = [];
  let cpu;
  system('cat /proc/cpuinfo').split(EOL).forEach(line => {
    switch (true) {
      case PROCESSOR.test(line):
        cpus[RegExp.$1.trim()] = (cpu = {
          model: '',
          speed: 0,
          get times() { return {}; }
        });
        break;
      case NAME.test(line):
        cpu.model = RegExp.$1.trim();
        break;
      case FREQ.test(line):
        cpu.speed = parseFloat(RegExp.$1.trim());
        break;
    }
  });
  return cpus;
};

this.endianness = () => 'LE';

this.freemem = () => {
  let I, mem = system('free -b').split(EOL);
  mem[0].split(/\s+/).some((info, i) => info === 'free' && (I = i));
  return parseFloat(mem[1].split(/\s+/)[I + 1]);
};

this.loadavg = () =>
  /(\d+(?:\.\d+))\s+(\d+(?:\.\d+))\s+(\d+(?:\.\d+))/.test(
    system('cat /proc/loadavg')
  ) && [
    parseFloat(RegExp.$1),
    parseFloat(RegExp.$2),
    parseFloat(RegExp.$3)
  ];

this.networkInterfaces = () => {
  const ifaces = {};
  system('ip addr').split(/^\d+:\s+/m).forEach(parseInterfaces, ifaces);
  return ifaces;
};

function parseInterfaces(info) {
  info = info.trim();
  if (info.length < 1) return;
  let iface = [], mac;
  for (let
    line,
    lines = info.split(EOL),
    i = 0; i < lines.length; i++
  ) {
    line = lines[i];
    switch (true) {
      case /link\/\S+\s+((?:\S{2}:)+\S{2})/.test(line):
        mac = RegExp.$1;
        break;
      case /inet(\d*)\s+(\S+)/.test(line):
        let
          ip = RegExp.$2.split('/'),
          v = RegExp.$1 || '4'
        ;
        iface.push({
          address: ip[0],
          netmask: (v === '4' ? getIPv4Subnet : getIPv6Subnet)(ip[1]),
          family: 'IPv' + v,
          mac: mac,
          internal: ip[0] === '127.0.0.1'
        });
        break;
    }
  }
  if (mac) this[info.slice(0, info.indexOf(':'))] = iface;
};

this.totalmem = () => {
  let I, mem = system('free -b').split(EOL);
  mem[0].split(/\s+/).some((info, i) => info === 'total' && (I = i));
  return parseFloat(mem[1].split(/\s+/)[I + 1]);
};

this.uptime = () => (
  Date.now() -
  Date.parse(system('uptime -s').replace(' ', 'T'))
) / 1000;

