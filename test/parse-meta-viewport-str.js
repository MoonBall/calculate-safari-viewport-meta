const assert = require('assert');

const parse = require('../parse');

let metaViewportStr;
let metaViewportObj;
let expected;

metaViewportStr =
  '<meta name="viewport" content="width=1000, height=1600, initial-scale=0.3" />';
expected = {
  width: 1000,
  height: 1600,
  initialScale: 0.3,
};
metaViewportObj = parse(metaViewportStr);
assert.deepStrictEqual(metaViewportObj, expected);

metaViewportStr = `<meta
  content="width=device-width, height=device-height, initial-scale=0.3, maximum-scale=4, minimum-scale=1" 
  name="viewport"
/>`;
expected = {
  width: 'device-width',
  height: 'device-height',
  initialScale: 0.3,
  maximumScale: 4,
  minimumScale: 1,
};
metaViewportObj = parse(metaViewportStr);
assert.deepStrictEqual(metaViewportObj, expected);
