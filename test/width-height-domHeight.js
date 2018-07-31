const assert = require('assert');

const calculate = require('../calculate');

const options = {
  deviceWidth: 375,
  deviceHeight: 553,
  defaultMinimumScale: 0.25,
  defaultMaximumScale: 5,
};

{
  const metaViewportStr = `
  <meta name="viewport" content="width=700, height=200" />
`;
  const domHeight = 300;
  const expected = {
    icbSize: {
      width: 700,
      height: 200,
    },
    viewportSize: {
      width: 203,
      height: 300,
    },
  };
  const result = calculate({
    ...options,
    metaViewportStr,
    domHeight,
  });

  assert.deepStrictEqual(result, expected);
}

{
  const metaViewportStr = `
  <meta name="viewport" content="width=200, height=10" />
`;
  const domHeight = 300;
  const expected = {
    icbSize: {
      width: 200,
      height: 111,
    },
    viewportSize: {
      width: 200,
      height: 295,
    },
  };
  const result = calculate({
    ...options,
    metaViewportStr,
    domHeight,
  });

  assert.deepStrictEqual(result, expected);
}
