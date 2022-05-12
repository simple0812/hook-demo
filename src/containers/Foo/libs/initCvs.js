//function initBgCvs(ctx) {
//    for(var i = 1, len = WIDTH*RATIO/GRIDEWIDTH; i < len ; i++) {
//        drawLine(ctx, i * GRIDEWIDTH -0.5 , 0, i * GRIDEWIDTH-0.5, HEIGHT*RATIO , 0.5, '#ccc');
//    }
//
//    for(var i = 1, len = HEIGHT*RATIO/GRIDEWIDTH; i < len ; i++) {
//        drawLine(ctx,  0, i * GRIDEWIDTH +.5 , WIDTH*RATIO, i * GRIDEWIDTH+.5 ,  0.5, '#ddd');
//    }

//}
import { text, drawLine } from './helper';

export default function initCoord() {
  var normalScaleLength = 5;
  var specialScaleLength = 10;
  let cvs = document.querySelector('#canvas');
  let xCoord = document.querySelector('#xCoord');
  let yCoord = document.querySelector('#yCoord');
  if (!cvs) {
    return;
  }

  let WIDTH = 375; // cvs.width;
  let HEIGHT = 720; // cvs.height;
  let RATIO = 1;
  let GRIDEWIDTH = 10;

  xCoord.setAttribute('width', WIDTH);
  xCoord.setAttribute('height', 30);

  yCoord.setAttribute('width', 30);
  yCoord.setAttribute('height', HEIGHT);

  var xCtx = xCoord.getContext('2d');

  var yCtx = yCoord.getContext('2d');

  var gw = GRIDEWIDTH * RATIO;
  for (let i = 0, len = (WIDTH * RATIO) / gw; i < len; i++) {
    var p = i % 5 == 0 ? 30 - specialScaleLength : 30 - normalScaleLength;
    drawLine(xCtx, i * gw + 0.5, p, i * gw + 0.5, 30, 1, 'blue');
    if (i == 0)
      text(
        xCtx,
        parseInt((i * gw) / RATIO) + '',
        i * gw,
        15,
        '10px',
        'black',
        'left'
      );
    else if (i % 5 == 0)
      text(
        xCtx,
        parseInt((i * gw) / RATIO) + '',
        i * gw,
        15,
        '10px',
        'black',
        'center'
      );
  }

  for (let i = 0, len = (HEIGHT * RATIO) / gw; i < len; i++) {
    let p = i % 5 == 0 ? 30 - specialScaleLength : 30 - normalScaleLength;
    drawLine(yCtx, p, i * gw + 0.5, 30, i * gw + 0.5, 1, 'blue');
    if (i == 0)
      text(
        yCtx,
        parseInt((i * gw) / RATIO) + '',
        5,
        i * gw,
        '10px',
        'black',
        'left',
        0
      );
    else if (i % 5 == 0)
      text(
        yCtx,
        parseInt((i * gw) / RATIO) + '',
        5,
        i * gw,
        '10px',
        'black',
        'center',
        0
      );
  }
}

export function drawCoordLine(x, y) {
  let RATIO = 1;
  let WIDTH = 375;
  let HEIGHT = 720;
  let coordCvs = document.querySelector('#coordcanvas');
  let coordCtx = coordCvs.getContext('2d');
  coordCvs.width += 0;
  x *= RATIO;
  y *= RATIO;
  drawLine(coordCtx, x + 0.5, 0, x + 0.5, HEIGHT * RATIO, 1, 'blue');
  drawLine(coordCtx, 0, y + 0.5, WIDTH * RATIO, y + 0.5, 1, 'blue');
}
