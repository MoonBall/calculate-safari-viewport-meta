// Convert meta tag of viewport to a object.
// The object has the following attributes.
// width, height, initialScale, minimumScale, maximumScale, userScalable.

const assert = require('assert');

function parse(metaViewportStr) {
  const content = metaViewportStr.match(/content="([^"]+)"/)[1];
  const keyValues = content.split(/\s*,\s*/).filter(it => it);
  return keyValues.reduce((obj, keyValueStr) => {
    const keyValueMatch = keyValueStr.match(/(.+)\s*=\s*(.+)/);
    const key = keyValueMatch[1];
    const value = keyValueMatch[2];
    const camelKey = key.replace(/-.?/g, s => (s[1] || '').toUpperCase());
    const valueNumber = parseFloat(value);
    const actualValue = Number.isNaN(valueNumber) ? value : valueNumber;

    obj[camelKey] = actualValue;
    return obj;
  }, {});
}

module.exports = parse;
