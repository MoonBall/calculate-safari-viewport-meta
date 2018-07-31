module.exports = calculate;

const parse = require('./parse');

// The following attributes must be set.
//  - metaViewportStr
//  - deviceWidth
//  - deviceHeight
//  - defaultMinimumScale
//  - defaultMaximumScale
// The following attributes is optional.
//  - domWidth
//  - domHeight
function calculate(options) {
  const metaViewportObj = parse(options.metaViewportStr);
  metaViewportObj.minimumScale =
    metaViewportObj.minimumScale || options.defaultMinimumScale;
  metaViewportObj.maximumScale =
    metaViewportObj.maximumScale || options.defaultMaximumScale;

  const icbSize = getIcbSize(
    metaViewportObj.width,
    metaViewportObj.height,
    metaViewportObj.initialScale,
    metaViewportObj.minimumScale,
    metaViewportObj.maximumScale,
    options.deviceWidth,
    options.deviceHeight
  );

  const canvasSize = getCanvasSize(
    icbSize.width,
    icbSize.height,
    options.domWidth,
    options.domHeight
  );

  const viewportSize = getViewpointSize(
    metaViewportObj.initialScale,
    metaViewportObj.minimumScale,
    metaViewportObj.maximumScale,
    canvasSize.width,
    canvasSize.height,
    options.deviceWidth,
    options.deviceHeight
  );

  return {
    icbSize: {
      width: Math.round(icbSize.width),
      height: Math.round(icbSize.height),
    },
    viewportSize: {
      width: Math.round(viewportSize.width),
      height: Math.round(viewportSize.height),
    },
  };
}

function min() {
  const args = [].slice.apply(arguments);
  return Math.min.apply(Math, args.filter(it => it != null));
}
function max() {
  const args = [].slice.apply(arguments);
  return Math.max.apply(Math, args.filter(it => it != null));
}

function restrictScale(scale, minimumScale, maximumScale) {
  if (scale < minimumScale) {
    return minimumScale;
  }
  return min(scale, maximumScale);
}
function getIcbSize(
  width,
  height,
  initialScale,
  minimumScale,
  maximumScale,
  deviceWidth,
  deviceHeight
) {
  let widthScale;
  let heightScale;
  let restrictedInitialScale;

  if (width != null) {
    widthScale = restrictScale(deviceWidth / width, minimumScale, maximumScale);
    if (height == null) {
      heightScale = widthScale;
    }
  }

  if (height != null) {
    heightScale = restrictScale(
      deviceHeight / height,
      minimumScale,
      maximumScale
    );
    if (width == null) {
      widthScale = heightScale;
    }
  }

  if (initialScale != null) {
    restrictedInitialScale = restrictScale(
      initialScale,
      minimumScale,
      maximumScale
    );
  }

  // initial containing block 应该尽量大，所以取小值，这样更容易占满屏幕
  widthScale = min(widthScale, restrictedInitialScale);
  heightScale = min(heightScale, restrictedInitialScale);

  if (widthScale === Infinity) {
    widthScale = heightScale = 1;
  }

  return {
    width: deviceWidth / widthScale,
    height: deviceHeight / heightScale,
  };
}

function getCanvasSize(icbWidth, icbHeight, domWidth, domHeight) {
  return {
    width: max(icbWidth, domWidth),
    height: max(icbHeight, domHeight),
  };
}

function getViewpointSize(
  initialScale,
  minimumScale,
  maximumScale,
  canvasWidth,
  canvasHeight,
  deviceWidth,
  deviceHeight
) {
  // The aspect ratio of viewport must equal to `deviceWidth / deviceHeight`.
  // So we only need a scale ratio.
  let scale;
  if (initialScale != null) {
    const restrictedInitialScale = restrictScale(
      initialScale,
      minimumScale,
      maximumScale
    );
    // 根据 getIcbSize()，如果存在 initial-scale，则有：
    // 1. widthScale <= restrictedInitialScale,
    // 2. icbWidth = deviceWidth / widthScale
    // 由 1, 2 推出 3：
    // 3. icbWidth >= deviceWidth / restrictedInitialScale
    // 4. canvasWidth >= icbWidth,
    // 由 3, 4 推出 5：
    // 5. canvasWidth >= deviceWidth / restrictedInitialScale
    // 对于垂直方向，高度同理。
    // 所以当 viewport 处于 restrictedInitialScale 缩放比例时，画布一定能撑满整个 viewport。
    scale = restrictedInitialScale;
  } else {
    // 根据画布的大小，选一个方向同 viewport 长度对齐。
    const widthScale = restrictScale(
      deviceWidth / canvasWidth,
      minimumScale,
      maximumScale
    );
    const heightScale = restrictScale(
      deviceHeight / canvasHeight,
      minimumScale,
      maximumScale
    );

    // 为了保证画布撑满 viewport, viewport 宽高需尽量小，所以去大值。
    scale = max(widthScale, heightScale);
  }

  return {
    width: deviceWidth / scale,
    height: deviceHeight / scale,
  };
}
