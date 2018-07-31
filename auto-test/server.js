const http = require('http');

// key 为远端 ip 地址，value 的信息包括：
// - deviceWidth
// - deviceHeight
// const remoteInfo = {};

const deviceWidth = 375;
const deviceHeight = 553;
const defaultMinimumScale = 0.25;
const defaultMaximumScale = 5;

http
  .createServer()
  .on('request', (req, res) => {
    const remoteAddress = req.socket.remoteAddress;
    if (!remoteInfo[remoteAddress]) {
    }
  })
  .listen(8080, () => {
    console.log('Visit ${server-ip}:8080 in your mobile Safari browser.');
  });

function getDeviceInfo(req, res) {
  res.end;
}
function calculate(req, res) {}

function nextUrl(options) {}

function getHtml(options) {
  const metaViewportKeys = [
    'width',
    'height',
    'initialScale',
    'minimumScale',
    'maximumScale',
  ];
  const metaViewportContent = Object.keys(options)
    .map(key => {
      if (metaViewportKeys.indexOf(key) >= 0 && options[key] != null) {
        const newKey = key.replace(/[A-Z]/g, t => '-' + t.toLowerCase());
        return `${newKey}=${options[key]}`;
      }

      return '';
    })
    .filter(it => it)
    .join(', ');

  const domStyle = `width: ${options.domWidth ||
    1}px; height: ${options.domHeight || 1}px; background: blue`;

  return `
<!DOCTYPE html>
<html lang="zh-hans" style="background: yellow">
  <head>
    <meta charset="utf8" />
    <meta name="viewport" content="${metaViewportContent}" />
  </head>

  <body style="margin: 0;">
    <div style="${domStyle}"></div>
  <script>

  </script>
  </body>
</html>
`;
}
