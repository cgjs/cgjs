module.exports = function createSubnet(size, segment, base, sep) {
  const empty = '0'.repeat(size);
  return  mask => {
    const str = ('1'.repeat(parseInt(mask, 10)) + empty).slice(0, size);
    const out = [];
    for (let i = 0; i < size; i += segment) {
      out.push(parseInt(str.substr(i, segment), 2).toString(base));
    }
    return out.join(sep);
  };
};
