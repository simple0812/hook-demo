import $ from 'jQuery';
import { windowToCanvas, cancelDefaultEvent } from './helper';
import datasource from '@/visualEditor/libs/datasource';
import _ from 'lodash';

let RATIO = 1;

var dragInfo = {
  ele: null,
  percentX: 0,
  percentY: 0,
  init: function () {
    this.ele = null;
    this.percentX = 0;
    this.percentY = 0;
    this.image = null;
  }
};

function aDragStart(e) {
  e = e || window.event;
  var target = e.target || e.srcElement;
  if (!target) return;
  e.dataTransfer.setData('TEXT', $(target).attr('title') || '图片');
  //   if (drawInfo.operRect && drawInfo.operRect.isSelected) {
  //     drawInfo.operRect.isSelected = false;
  //     render();
  //     clearTempCvs();
  //     drawInfo.init();
  //   }

  dragInfo.ele = target;
  dragInfo.percentX = 0.5;
  dragInfo.percentY = 0.5;
  //e.preventDefault();
  //return true;
}

function renderText(tag, offsetX, offsetY, type) {
  //   var rect = getRectByType(type);
  //   offsetX -= rect.width * dragInfo.percentX;
  //   offsetY -= rect.height * dragInfo.percentY;
  //   rect = rect.changePlace(
  //     new Rect(offsetX, offsetY, offsetX + rect.width, offsetY + rect.height)
  //   );
  //   rect.tag = tag || '图片';
  //   var tempRect = null;
  //   if (!checkRectIsCoverRects(rect, 2)) {
  //     //面板与文字重合 将文字作为面板的子内容
  //     if ((tempRect = checkRectIsCoverRects(rect, 3)))
  //       tempRect.setChildrenRect(rect);
  //     else relativePlaylist.children[viewIndex].children.push(rect);
  //     if (rect.constructor == MediaZone) rect.addPlaylist();
  //     render();
  //   }
  //   dragInfo.init();
}

export default (instance) => {
  let tempCvs = document.querySelector('#topcanvas');
  let cvsarea = document.querySelector('#cvsarea');
  let cvs = document.querySelector('#canvas');
  let tempCtx = tempCvs.getContext('2d');

  $('.ve-dragnode').each(function (i, o) {
    o.ondragstart = aDragStart;
    o.ondragend = dragEnd;
  });

  cvsarea.ondragover = function (e) {
    e = e || window.event;
    // var target = e.target || e.srcElement;
    var loc = windowToCanvas(cvs, e.clientX, e.clientY);
    var offsetX = loc.x;
    var offsetY = loc.y;
    var $component = $(dragInfo.ele).attr('data-component');
    var xcomponent = datasource.find((item) => item.$component === $component);
    if (!xcomponent) {
      xcomponent = {
        designWidth: 375,
        designHeight: 100
      };
    }

    tempCvs.width += 0;
    tempCtx.save();
    offsetX -= xcomponent.designWidth * dragInfo.percentX;
    offsetY -= xcomponent.designHeight * dragInfo.percentY;
    tempCtx.lineWidth = 0.5;
    tempCtx.scale(RATIO, RATIO);
    tempCtx.strokeStyle = 'blue';
    tempCtx.strokeRect(
      offsetX,
      offsetY,
      xcomponent.designWidth,
      xcomponent.designHeight
    );
    tempCtx.restore();

    e.preventDefault();
    return true;
  };

  cvsarea.ondrop = function (e) {
    const { eles } = instance.state;
    e = e || window.event;
    var target = e.target || e.srcElement;
    console.log('ondrop', target);
    var loc = windowToCanvas(cvs, e.clientX, e.clientY);
    var offsetX = loc.x;
    var offsetY = loc.y;

    if (!dragInfo.ele) return;
    tempCvs.width += 0;
    var $component = $(dragInfo.ele).attr('data-component');
    var xcomponent = datasource.find((item) => item.$component === $component);

    if (xcomponent) {
      xcomponent = _.cloneDeep(xcomponent);
      xcomponent.$id = 'ele_' + String(Math.random()).slice(2);
    }

    eles.push(xcomponent);
    instance.setState({
      eles
    });

    return cancelDefaultEvent(e);
  };

  function dragEnd() {
    tempCvs.width += 0;
  }
};
