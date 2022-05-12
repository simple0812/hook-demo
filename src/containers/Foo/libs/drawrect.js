import _ from 'lodash';
import $ from 'jQuery';

var canvasEditor = {
  _o: $({}),
  subscribe: function () {
    this._o.on.apply(this._o, arguments);
  },
  unSubscribe: function () {
    this._o.off.apply(this._o, arguments);
  },
  publish: function () {
    this._o.trigger.apply(this._o, arguments);
  }
};

canvasEditor.subscribe('pretranslate', function (e, x, y) {
  translateInfo.x = x;
  translateInfo.y = y;
  drawInfo.leftBtnDown = true;
});

canvasEditor.subscribe('prestroke', function (e) {
  preStroke.apply(preStroke, _.rest(arguments));
});

canvasEditor.subscribe('preresize', function (e) {
  preResize.apply(preResize, _.rest(arguments));
});

canvasEditor.subscribe('premove', function (e) {
  preMove.apply(preMove, _.rest(arguments));
});

canvasEditor.subscribe('select', function (e) {
  select.apply(select, _.rest(arguments));
});

canvasEditor.subscribe('unselect', function (e) {
  stroke(drawInfo.operRect);
  $('#detailarea').empty();
  clearTempCvs();
});

canvasEditor.subscribe('stroking', function (e, x, y) {
  drawInfo.operRect.moveEndPointTo(x, y);
  stroking(drawInfo.operRect);
});

canvasEditor.subscribe('resizing', function (e) {
  resizing.apply(resizing, _.rest(arguments));
});

canvasEditor.subscribe('moving', function (e, x, y) {
  drawInfo.operRect.left = drawInfo.operRect.parent
    ? x - moveInfo.x - drawInfo.operRect.parent.left
    : x - moveInfo.x;
  drawInfo.operRect.top = drawInfo.operRect.parent
    ? y - moveInfo.y - drawInfo.operRect.parent.top
    : y - moveInfo.y;
  drawInfo.operRect.right = drawInfo.operRect.left + drawInfo.operRect.width;
  drawInfo.operRect.bottom = drawInfo.operRect.top + drawInfo.operRect.height;
  moving(drawInfo.operRect);
});

canvasEditor.subscribe('copy', function (e, x, y) {
  if (!drawInfo.copy) drawInfo.copy = 'true';
  //console.log(drawInfo.origRect.type);
  //var x = Rect.create(json);
  drawInfo.operRect.isSelected = false;

  drawInfo.operRect = drawInfo.operRect.copy();
  //if(drawInfo.operRect.playlist) drawInfo.operRect.playlist= null;
  drawInfo.operRect.left = drawInfo.operRect.parent
    ? drawInfo.operRect.left + drawInfo.operRect.parent.left
    : drawInfo.operRect.left;
  drawInfo.operRect.top = drawInfo.operRect.parent
    ? drawInfo.operRect.top + drawInfo.operRect.parent.top
    : drawInfo.operRect.top;

  drawInfo.operRect.parent = null;
  //drawInfo.operRect.isSelected = true;
  render();
  console.log(drawInfo.operRect);
  drawInfo.operRect.left = drawInfo.operRect.parent
    ? x - moveInfo.x - drawInfo.operRect.parent.left
    : x - moveInfo.x;
  drawInfo.operRect.top = drawInfo.operRect.parent
    ? y - moveInfo.y - drawInfo.operRect.parent.top
    : y - moveInfo.y;
  drawInfo.operRect.right = drawInfo.operRect.left + drawInfo.operRect.width;
  drawInfo.operRect.bottom = drawInfo.operRect.top + drawInfo.operRect.height;
  moving(drawInfo.operRect);
});

canvasEditor.subscribe('translating', function (e) {
  translating.apply(translating, _.rest(arguments));
});

canvasEditor.subscribe('stroke', function (e) {
  stroke.apply(stroke, _.rest(arguments));
});

var drawInfo = {
  leftBtnDown: false,
  type: null, //'groupZone', 'mediaZone','text'
  action: null, //'resize', 'move', 'stroke', 'selected', 'translate'
  operRect: null,
  origRect: null,
  init: function () {
    this.leftBtnDown = false;
    this.action = null;
    this.operRect = null;
    this.origRect = null;

    $('#cvsarea').css('cursor', 'default');
  }
};

var moveInfo = {
  x: 0,
  y: 0,
  init: function () {
    this.x = 0;
    this.y = 0;
  }
};

var translateInfo = {
  x: 0,
  y: 0,
  init: function () {
    this.x = 0;
    this.y = 0;
  }
};

var resizeInfo = { index: 7 }; //缩放选择的点索引

cvsarea.onmousedown = function (e) {
  e = e || window.event;
  var src = e.target || e.srcElement;
  var loc = windowToCanvas(cvs, e.clientX, e.clientY);
  var x = loc.x;
  var y = loc.y;

  if (e.button != 0) return;
  if (!checkPointIsInCvs(x, y)) return;
  var sRect = checkPointIsInRects(x, y);

  if (drawInfo.action == 'translate')
    return canvasEditor.publish('pretranslate', [e.clientX, e.clientY]);

  if (drawInfo.action == 'selected') {
    if (
      !checkPointIsInRect(x, y, drawInfo.operRect) &&
      src.className != 'dot' &&
      src.className != 'movediv'
    )
      canvasEditor.publish('unselect');
    else sRect = null;
  }

  if (sRect) canvasEditor.publish('select', [sRect]);
  else if (src.className == 'topcanvas')
    canvasEditor.publish('prestroke', [x, y, src]);
  else if (src.className == 'dot') canvasEditor.publish('preresize', [src]);
  else if (src.className == 'movediv') canvasEditor.publish('premove', [x, y]);
  else clearTempCvs();
};

window.onmousemove = function (e) {
  var src = e.target || e.srcElement;
  var loc = windowToCanvas(cvs, e.clientX, e.clientY);
  var x = loc.x;
  var y = loc.y;
  drawCoordLine(x, y);

  if (!drawInfo.leftBtnDown || !drawInfo.action) return;

  if (e.altKey && drawInfo.action == 'move')
    canvasEditor.publish('copy', [x, y]);
  else if (drawInfo.action == 'selected' && src.className == 'movediv')
    canvasEditor.publish('premove', [x, y]);
  else if (drawInfo.action == 'selected' && src.className == 'dot')
    canvasEditor.publish('preresize', [src]);
  else if (drawInfo.action == 'translate')
    canvasEditor.publish('translating', [e.clientX, e.clientY]);
  else if (drawInfo.action == 'stroke')
    canvasEditor.publish('stroking', [x, y]);
  else if (drawInfo.action == 'resize')
    canvasEditor.publish('resizing', [drawInfo.operRect, x, y]);
  else if (drawInfo.action == 'move') canvasEditor.publish('moving', [x, y]);
};

window.onmouseup = function (e) {
  e = e || window.event;
  var src = e.target || e.srcElement;

  if (
    e.button != 0 ||
    !drawInfo.operRect ||
    !drawInfo.leftBtnDown ||
    !drawInfo.action ||
    drawInfo.action == 'selected'
  )
    return (drawInfo.leftBtnDown = false);

  if (
    drawInfo.action == 'move' &&
    drawInfo.operRect.left == drawInfo.origRect.left &&
    drawInfo.operRect.top == drawInfo.origRect.top
  ) {
    drawInfo.leftBtnDown = false;
    drawInfo.action = 'selected';
    return;
  }

  clearTempCvs();
  //清理已被选中的矩形详情
  $('#detailarea').empty();
  canvasEditor.publish('stroke', [drawInfo.operRect]);
};

function select(rect) {
  drawInfo.origRect = rect.clone();
  rect.isSelected = true;
  drawInfo.operRect = rect;
  drawInfo.action = 'selected';
  drawInfo.leftBtnDown = true;
  drawInfo.type = null;
  $('#toolbar .btn').removeClass('btn-primary');

  render();
  showDetail(rect);
  return rect;
}

function preStroke(x, y, ele) {
  if (!drawInfo.type) return;

  drawInfo.leftBtnDown = true;
  drawInfo.action = 'stroke';
  drawInfo.operRect = getRectByType(drawInfo.type);

  drawInfo.operRect.left = x;
  drawInfo.operRect.top = y;
  drawInfo.operRect.tag = $('#toolbar .btn-primary').attr('title');
  if (
    drawInfo.operRect.constructor == ImageRect ||
    drawInfo.operRect.constructor.superClass == ImageRect
  ) {
    var obj =
      $('#toolbar .btn-primary img').length == 0
        ? $('#toolbar .btn-primary')
        : $('#toolbar .btn-primary img');
    var img = new Image();
    img.onload = function () {
      var w = img.width;
      var h = img.height;

      drawInfo.operRect.source = new ImageInfo(
        img.src.replace(/http:\/\/[^\/]+(:\d{2,8})?\//, '/'),
        w,
        h
      );
      drawInfo.operRect.url = img.src.replace(
        /http:\/\/[^\/]+(:\d{2,8})?\//,
        '/'
      );

      if (
        !_.find(IMAGES, function (each) {
          return (
            each.src.trimUrlPath() ==
            img.src.replace(/http:\/\/[^\/]+(:\d{2,8})?\//, '/')
          );
        })
      )
        IMAGES.push({
          src: img.src.replace(/http:\/\/[^\/]+(:\d{2,8})?\//, '/'),
          image: img
        });
    };

    img.src = obj.attr('url') || obj.attr('src');
  }
}

function preMove(x, y) {
  drawInfo.leftBtnDown = true;
  drawInfo.action = 'move';
  moveInfo.x = x - (parseInt($('.movediv').css('left')) - TRANSLATE.x) / RATIO;
  moveInfo.y = y - (parseInt($('.movediv').css('top')) - TRANSLATE.y) / RATIO;
}

function preResize(src) {
  drawInfo.leftBtnDown = true;
  drawInfo.action = 'resize';
  resizeInfo.index = src.index;
}

function stroking(rect) {
  clearTempCvs();
  tempCtx.save();
  tempCtx.scale(RATIO, RATIO);
  tempCtx.strokeStyle = 'red';

  tempCtx.strokeRect(
    rect.parent ? rect.left + rect.parent.left : rect.left,
    rect.parent ? rect.parent.top + rect.top : rect.top,
    rect.width,
    rect.height
  );

  tempCtx.restore();
}

function moving(rect) {
  showDetail(rect);
}

function resizing(rect, x, y) {
  var coords = getRectCoords(rect, x, y);
  var left = coords[0];
  var top = coords[1];
  var right = coords[2];
  var bottom = coords[3];
  if (rect.parent) {
    left -= rect.parent.left;
    top -= rect.parent.top;
    right -= rect.parent.left;
    bottom -= rect.parent.top;
  }

  if (left >= right - 5 || top >= bottom - 5) return rollBack();

  var tempRect = new Rect(left, top, right, bottom);

  drawInfo.operRect = drawInfo.operRect.changePlace(tempRect);

  showDetail(drawInfo.operRect);
}

function stroke(rect) {
  if (
    !rect.bottom ||
    !rect.right ||
    Math.abs(rect.width) < 5 ||
    Math.abs(rect.height) < 5
  ) {
    drawInfo.leftBtnDown = false;
    return; // alert('矩形过小');
  }

  //矩形不在画布范围
  if (checkRectIsOut(rect)) {
    removeRect(rect);
    render();
    return drawInfo.init();
  }

  //矩形与其他矩形重合
  if (checkRectIsCoverRects(rect, 2)) {
    if (drawInfo.operRect) {
      if (drawInfo.origRect) drawInfo.operRect.changePlace(drawInfo.origRect); //画图的时候origRect 不存在
      drawInfo.operRect.isSelected = false;
    }
    render();
    drawInfo.init();
    return;
  }

  rect.stroke();
  render();
  drawInfo.init();
  moveInfo.init();
}

function removeRect(tempRect) {
  if (drawInfo.operRect && drawInfo.operRect.parent) {
    var parentRect = getRectByRect(tempRect.parent);
    parentRect.children = _.without(parentRect.children, tempRect);
  } else {
    var t = 0;
    if (tempRect.constructor == MediaZone) {
      //delete playlist
      delMediaSourceById(tempRect.playlist);
      t = MediaBase.duration.parse(tempRect.duration);
    }
    relativePlaylist.children[viewIndex].children = _.without(
      relativePlaylist.children[viewIndex].children,
      tempRect
    );
    if (tempRect.constructor == MediaZone) {
      //删除媒体资源
      delMediaSourceById(tempRect.playlist);
      var currScene = relativePlaylist.children[viewIndex];

      //修改duration
      var p = MediaBase.duration.parse(currScene.duration);
      if (p == t) currScene.duration = '00:00:00';
      updateCurrSceneDuration(); //要在删除媒体后重新计算
    }
  }
}

function rollBack() {
  drawInfo.operRect.changePlace(drawInfo.origRect);
  drawInfo.operRect.isSelected = false;
  render();
  drawInfo.init();
  clearTempCvs();
}

function render() {
  //全部重绘
  cvs.width += 0;
  $('#compnentindex').empty();
  for (
    var i = 0, len = relativePlaylist.children[viewIndex].children.length;
    i < len;
    i++
  ) {
    var tempRect = relativePlaylist.children[viewIndex].children[i];
    if (tempRect) tempRect.render();
  }

  var currScene = relativePlaylist.children[viewIndex];

  if (!getSelectedRect()) {
    var xCtx = getOrCreateCanvas(viewIndex, currScene).getContext('2d');
    xCtx.putImageData(
      ctx.getImageData(0, 0, WIDTH * RATIO, HEIGHT * RATIO),
      0,
      0
    );
    showCurrentArea();
  }

  if (currScene.background.image) {
    $('#canvas')
      .css('background', 'url("' + currScene.background.image + '") ')
      .css('backgroundSize', '100% 100%');
    $('#leftside canvas')
      .eq(viewIndex)
      .css('background', 'url("' + currScene.background.image + '") ')
      .css('backgroundSize', '100% 100%');
  } else if (currScene.background.color) {
    $('#canvas').css('background', hexToRgb(currScene.background.color));
    $('#leftside canvas')
      .eq(viewIndex)
      .css('background', hexToRgb(currScene.background.color));
  }

  //console.clear();
  //console.log(JSON.stringify(currScene))
}

function showCurrentArea() {
  var div = $('.currentarea') || document.createElement('div');

  if (div.length == 0) {
    div = document.createElement('div');
    div.className = 'currentarea';
  }
  var wImg = $('.activecvs').find('canvas').width();
  var hImg = $('.activecvs').find('canvas').height();

  var wArea = $('#cvsarea').width();
  var hArea = $('#cvsarea').height();

  var wCvs = $('#canvas').width();
  var hCvs = $('#canvas').height();

  var w = (wArea * wImg) / wCvs;
  var h = (hArea * hImg) / hCvs;
  var t = ((TRANSLATE.y * wImg) / wCvs) * -1;
  var l = ((TRANSLATE.x * wImg) / wCvs) * -1;

  //if(w > wImg) w = wImg;
  //if(h > hImg) h = hImg;
  $(div).css({
    width: w,
    height: h,
    border: '1px solid red',
    position: 'absolute',
    top: t,
    left: l,
    opacity: 0.3,
    background: 'yellow'
  });

  $('.activecvs').children('.panel-body').append(div);
}

function showDetail(rect) {
  stroking(rect);
  rect.showDetail();
}

function showSelectedRect(rect) {
  var points = getRectDots(rect);
  var cursors = [
    'nw-resize',
    'n-resize',
    'ne-resize',
    'w-resize',
    'e-resize',
    'sw-resize',
    's-resize',
    'se-resize'
  ];

  for (var i = 0, len = points.length; i < len; i++) {
    var x = points[i][0] * RATIO + TRANSLATE.x;
    var y = points[i][1] * RATIO + TRANSLATE.y;
    var div = document.createElement('div');
    div.index = i;
    $(div).addClass('dot');
    $(div).css({ top: y - 3, left: x - 3, cursor: cursors[i] });

    $('#cvsarea').append(div);
  }
}

function clearTempCvs() {
  tempCvs.width += 0; //清除dot和movediv
  $('#cvsarea .dot').remove();
  $('#cvsarea .movediv').remove();
}

function switchRect(obj) {
  if ($(obj).parent().parent('ul').length > 0) {
    var currIndex = $('#compnentindex').children('li').index($(obj).parent());
    if (drawInfo.operRect) drawInfo.operRect.isSelected = false;
    select(relativePlaylist.children[viewIndex].children[currIndex]);
  } else {
    var currIndex = $(obj)
      .parent()
      .parent()
      .children('li')
      .index($(obj).parent());
    var parentLi = $(obj).parent().parent().parent();
    var parentIndex = $(parentLi).parent().children('li').index($(parentLi));
    if (drawInfo.operRect) drawInfo.operRect.isSelected = false;
    select(
      relativePlaylist.children[viewIndex].children[parentIndex].children[
        currIndex
      ]
    );
  }

  drawInfo.leftBtnDown = false;
}

function removeSelectedRect() {
  if (!drawInfo.operRect) return;

  if (window.confirm('确认删除吗？')) {
    removeRect(drawInfo.operRect);
    render();
    clearTempCvs();
    drawInfo.init();
    $('#detailarea').empty();
  }
}

function preTranslate(obj) {
  $('#toolbar .btn').removeClass('btn-primary');

  drawInfo.type = null;
  if (drawInfo.action == 'translate') {
    //$(obj).removeClass('btn-primary');
    $(obj).attr('src', '/images/component/鼠标箭头.png');
    drawInfo.action = null;
    $('#cvsarea').css('cursor', 'default');
  } else {
    //$(obj).addClass('btn-primary');
    $(obj).attr('src', '/images/component/十字箭头.png');
    renderSelectedRect();
    drawInfo.action = 'translate';
    $('#cvsarea').css('cursor', 'move');
  }
}

function translating(x, y) {
  var t = parseFloat($('#cvsarea canvas').css('top')) || 0;
  var l = parseFloat($('#cvsarea canvas').css('left')) || 0;
  var ty = t - translateInfo.y + y;
  var tx = l - translateInfo.x + x;
  TRANSLATE.x = tx;
  TRANSLATE.y = ty;
  translateInfo.x = x;
  translateInfo.y = y;

  $('#cvsarea canvas').css({ top: ty, left: tx });
  $('#xCoord').css({ left: tx + 30 });
  $('#yCoord').css({ top: ty + 30 });

  ctx.translate(TRANSLATE.x, TRANSLATE.y);
  tempCtx.translate(TRANSLATE.x, TRANSLATE.y);
  bgCtx.translate(TRANSLATE.x, TRANSLATE.y);
  ctx.translate(TRANSLATE.x, TRANSLATE.y);

  showCurrentArea();
}

function resetCvs(obj) {
  $('#sceneratio').val('1');
  scaleView('#sceneratio');
  TRANSLATE.x = 0;
  TRANSLATE.y = 0;

  $('#cvsarea canvas').css({ top: 0, left: 0 });
  $('#xCoord').css({ left: 30 });
  $('#yCoord').css({ top: 30 });
  renderSelectedRect();
  showCurrentArea();
}

// function initColorPicker() {
//   $('#detailarea .txtBgColor').spectrum({
//     color: 'rgba(255,255,255,0)',
//     showInput: true,
//     chooseText: '选取',
//     cancelText: '取消',
//     showPalette: true,
//     showInitial: false,
//     preferredFormat: 'rgb',
//     showAlpha: true,
//     palette: palettes,
//     change: function (color) {
//       $('#detailarea .txtBgColor').css('background-color', color.toString());
//       updateBg();
//     }
//   });
//   $('#detailarea .txtForeColor').spectrum({
//     color: 'rgba(255,255,255,0)',
//     showInput: true,
//     chooseText: '选取',
//     cancelText: '取消',
//     showPalette: true,
//     showInitial: false,
//     preferredFormat: 'rgb',
//     showAlpha: true,
//     palette: palettes,
//     change: function (color) {
//       $('#detailarea .txtForeColor').css('background-color', color.toString());
//       updateFontColor();
//       //alert(rgbToHex($("#detailarea .txtForeColor").spectrum("get")))
//     }
//   });
// }
