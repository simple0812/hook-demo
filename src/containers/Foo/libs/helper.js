export function checkPointIsInCvs(x, y) {
  if (x >= 0 && x <= window.WIDTH && y >= 0 && y <= window.HEIGHT) return true;
  return false;
}

export function checkPointIsInRect(x, y, rect) {
  var left = rect.parent ? rect.parent.left + rect.left : rect.left;
  var top = rect.parent ? rect.parent.top + rect.top : rect.top;
  var right = left + rect.width;
  var bottom = top + rect.height;

  if (x >= left && x <= right && y >= top && y <= bottom) return rect;
  return false;
}

export function checkRectIsCoverRect(targetRect, origRect) {
  targetRect.format();
  origRect.format();
  var tLeft = targetRect.parent
    ? targetRect.parent.left + targetRect.left
    : targetRect.left;
  var tTop = targetRect.parent
    ? targetRect.parent.top + targetRect.top
    : targetRect.top;
  var tBottom = tTop + targetRect.height;
  var tRight = tLeft + targetRect.width;

  var oLeft = origRect.parent
    ? origRect.parent.left + origRect.left
    : origRect.left;
  var oTop = origRect.parent
    ? origRect.parent.top + origRect.top
    : origRect.top;
  var oBottom = oTop + origRect.height;
  var oRight = oLeft + origRect.width;

  var minx = Math.max(tLeft, oLeft);
  var miny = Math.max(tTop, oTop);
  var maxx = Math.min(tRight, oRight);
  var maxy = Math.min(tBottom, oBottom);

  if (!(minx >= maxx || miny >= maxy)) return true;
  return false;
}

export function checkPointIsOut(x, y) {
  if (x >= 0 && x <= window.WIDTH && y >= 0 && y <= window.HEIGHT) return false;
  return true;
}

export function checkRectIsOut(rect) {
  if (!rect || rect.parent) return false;
  if (
    rect.left >= window.WIDTH ||
    rect.top >= window.HEIGHT ||
    rect.right <= 0 ||
    rect.bottom <= 0
  )
    return true;
  return false;
}

export function fillBg(ctx, src) {
  var img = new Image();
  img.onload = function () {
    var pattern = ctx.createPattern(img, 'repeat-y');
    ctx.fillStyle = pattern;
    ctx.fillRect(0, 0, img.width, img.height);
  };
  img.src = src;
}

export function text(ctx, str, x, y, font, color, align, dir) {
  ctx.save();
  ctx.beginPath();
  ctx.font = font;
  ctx.textAlign = align;
  ctx.fillStyle = color;

  if (dir != undefined && dir != null) {
    ctx.translate(x, y);
    ctx.rotate(Math.PI / 2);
    ctx.fillText(str, 0, 0);
  } else {
    ctx.fillText(str, x, y);
  }

  ctx.restore();
  ctx.closePath();
}

export function wrapText(
  context,
  words,
  x,
  y,
  fontStyle,
  color,
  maxWidth,
  maxHeight,
  lineHeight
) {
  context.save();
  //ctx.scale(RATIO, RATIO);
  var line = '';

  context.font = fontStyle;
  context.fillStyle = color;
  context.textAlign = 'left';
  context.textBaseline = 'top';
  context.rect(x, y, maxWidth, maxHeight);
  context.clip();

  //console.log(/\n/g.test(words) + '============++=========');
  //匹配换行
  var arr = words.split(/\n/g);
  for (var i = 0, len = arr.length; i < len; i++) {
    var temp = arr[i];
    let testWidth = 0;
    for (var n = 0; n < temp.length; n++) {
      var testLine = line + temp[n];
      var metrics = context.measureText(testLine);
      testWidth = metrics.width;
      if (testWidth > maxWidth) {
        context.fillText(line, x, y);
        line = temp[n];
        y += lineHeight;
      } else line = testLine;
    }
    context.fillText(line, x, y);
    line = '';
    y += lineHeight;
  }

  //不匹配换行
  //    for(var n = 0; n < words.length; n++) {
  //        var testLine = line + words[n];
  //        var metrics = context.measureText(testLine);
  //        var testWidth = metrics.width;
  //        if(testWidth > maxWidth ) {
  //            context.fillText(line, x, y); //若换行 则先渲染上一行
  //            line = words[n];
  //            y += lineHeight;
  //        }
  //        else {
  //            line = testLine;
  //        }
  //    }
  //    context.fillText(line, x, y);

  context.restore();
}

export function drawLine(ctx, left, top, right, bottom, width, style) {
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(left, top);
  ctx.lineTo(right, bottom);
  ctx.lineWidth = width;
  ctx.strokeStyle = style;
  ctx.stroke();
  ctx.restore();
  ctx.closePath();
}

export function drawArc(
  ctx,
  left,
  top,
  sradius,
  startAngle,
  endAngle,
  fillstyle,
  anticlockwise
) {
  ctx.save();
  ctx.beginPath();

  ctx.arc(left, top, sradius, startAngle, endAngle, anticlockwise);
  ctx.fillStyle = fillstyle;

  ctx.fill();
  ctx.restore();
  ctx.closePath();
}

export function getRectDots(rect) {
  if (rect.parent)
    return [
      [rect.left + rect.parent.left, rect.top + rect.parent.top],
      [
        rect.left + rect.parent.left + rect.width / 2,
        rect.top + rect.parent.top
      ],
      [rect.right + rect.parent.left, rect.top + rect.parent.top],
      [
        rect.left + rect.parent.left,
        rect.top + rect.parent.top + rect.height / 2
      ],
      [
        rect.right + rect.parent.left,
        rect.top + rect.parent.top + rect.height / 2
      ],
      [rect.left + rect.parent.left, rect.bottom + rect.parent.top],
      [
        rect.left + rect.parent.left + rect.width / 2,
        rect.bottom + rect.parent.top
      ],
      [rect.right + rect.parent.left, rect.bottom + rect.parent.top]
    ];
  else
    return [
      [rect.left, rect.top],
      [rect.left + rect.width / 2, rect.top],
      [rect.right, rect.top],
      [rect.left, rect.top + rect.height / 2],
      [rect.right, rect.top + rect.height / 2],
      [rect.left, rect.bottom],
      [rect.left + rect.width / 2, rect.bottom],
      [rect.right, rect.bottom]
    ];
}

let resizeInfo = {};

export function getRectCoords(rect, x, y) {
  var points = getRectDots(rect);
  var w = rect.width;
  var h = rect.height;
  var left, top, right, bottom;

  switch (resizeInfo.index) {
    case 0:
      //left = x;
      top = y;
      right = points[7][0];
      bottom = points[7][1];
      left = right - ((bottom - top) * w) / h; //等比
      break;

    case 1:
      top = y;
      right = points[7][0];
      bottom = points[7][1];
      left = points[0][0];
      break;

    case 2:
      //            left = x;
      top = y;
      right = points[5][0];
      bottom = points[5][1];
      left = right + ((bottom - top) * w) / h; //等比
      break;

    case 3:
      left = x;
      right = points[7][0];
      bottom = points[7][1];
      top = points[0][1];
      break;

    case 4:
      top = points[0][1];
      left = points[0][0];
      right = x;
      bottom = points[5][1];
      break;

    case 5:
      //            left = x;
      top = y;
      right = points[2][0];
      bottom = points[2][1];
      left = right + ((bottom - top) * w) / h; //等比
      break;

    case 6:
      left = points[0][0];
      top = points[0][1];
      bottom = y;
      right = points[7][0];

      break;

    case 7:
      left = points[0][0];
      top = points[0][1];
      bottom = y;
      right = left + ((bottom - top) * w) / h; //等比
      break;

    default:
      break;
  }

  return [
    Math.min(left, right),
    Math.min(top, bottom),
    Math.max(left, right),
    Math.max(top, bottom)
  ];
}

export function windowToCanvas(canvas, x, y) {
  //鼠标坐标点切换
  let RATIO = 1;
  var bbox = canvas.getBoundingClientRect();

  return {
    x: ((x - bbox.left) * (canvas.width / bbox.width)) / RATIO,
    y: ((y - bbox.top) * (canvas.height / bbox.height)) / RATIO
  };
}

export function cancelDefaultEvent(e) {
  if (e && e.preventDefault) {
    e.preventDefault();
    e.stopPropagation();
  } else {
    e.returnValue = false;
    e.cancelBubble = false;
  }

  return false;
}
