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
  <meta name="viewport" content="width=900, height=1000" />
`;
  const domWidth = 700;
  const domHeight = 1200;
  const expected = {
    icbSize: {
      width: 900,
      height: 1000,
    },
    viewportSize: {
      width: 814,
      height: 1200,
    },
  };
  const result = calculate({
    ...options,
    metaViewportStr,
    domWidth,
    domHeight,
  });

  assert.deepStrictEqual(result, expected);
}

{
  const metaViewportStr = `
  <meta name="viewport" content="width=200, height=10" />
`;
  const domWidth = 1600;
  const domHeight = 3000;
  const expected = {
    icbSize: {
      width: 200,
      height: 111,
    },
    viewportSize: {
      width: 1500,
      height: 2212,
    },
  };
  const result = calculate({
    ...options,
    metaViewportStr,
    domWidth,
    domHeight,
  });

  assert.deepStrictEqual(result, expected);
}
