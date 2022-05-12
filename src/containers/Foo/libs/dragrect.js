import $ from 'jQuery';
import { windowToCanvas, cancelDefaultEvent } from './helper';
import datasource from '@/visualEditor/libs/datasource';
import _ from 'lodash';

let RATIO = 1;

var dragInfo = {
  ele: null,
  percentX: 0,
  percentY: 0
};

export default (instance) => {
  let tempCvs = document.querySelector('#topcanvas');
  let cvsarea = document.querySelector('#cvsarea');
  let cvs = document.querySelector('#canvas');
  let tempCtx = tempCvs.getContext('2d');

  $('.ve-dragnode').on('dragstart', aDragStart);
  $('.ve-dragnode').on('dragend', dragEnd);

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
  function aDragStart(e) {
    e = e || window.event;
    var target = e.target || e.srcElement;
    if (!target) return;

    console.log(
      'zzzzzzzzzzzzzzzzzzzzzdddd',
      target,
      $(target).attr('id'),
      instance.state.selectedId
    );

    dragInfo.ele = target;
    dragInfo.percentX = 0.5;
    dragInfo.percentY = 0.5;
  }
};
