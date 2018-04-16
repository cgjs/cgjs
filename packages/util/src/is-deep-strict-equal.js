const isDeepStrictEqual = (a, b, s) => {
  if (a === b) return true;
  else if (typeof a === typeof b) {
    const knowsB = s.has(b);
    if (s.has(a)) return knowsB;
    else if (knowsB) return !s.add(a);
    s.add(a).add(b);
    const ak = Reflect.ownKeys(a);
    const bk = Reflect.ownKeys(b);
    if (ak.length === bk.length)
      return ak.every(k => isDeepStrictEqual(a[k], b[k], s));
  }
  return false;
};

module.exports = (a, b) => {
  return isDeepStrictEqual(a, b, new Set);
};