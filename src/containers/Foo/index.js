import React, { useEffect, Component } from 'react';
import mobxInjectStore from '@/utils/mobxInjectStore';
import Test from '@/utils/test';
import _ from 'lodash';
import $ from 'jQuery';
import initCoord, { drawCoordLine } from './libs/initCvs';
import dragrect from './libs/dragrect';
import { windowToCanvas } from './libs/helper';
import './index.less';
import './canvas.less';

import datasource from '@/visualEditor/libs/datasource';
import factory from '@/visualEditor/libs/factory';
import VisualMask from '@/visualEditor/VisualMask';
let moveFn = _.throttle((e) => {
  // var src = e.target || e.srcElement;
  let cvs = document.querySelector('#canvas');
  var loc = windowToCanvas(cvs, e.clientX, e.clientY);
  var x = loc.x;
  var y = loc.y;
  // if (x < 0 || y < 0) {
  //   return;
  // }
  drawCoordLine(x, y);
}, 1000 / 60);

class FooPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      eles: []
    };
  }

  componentDidMount() {
    initCoord();
    dragrect(this);

    window.addEventListener('mousemove', moveFn);
  }

  componentWillUnmount() {
    window.removeEventListener('mousemove', moveFn);
  }

  render() {
    const { eles } = this.state;
    return (
      <div className="fooPage">
        <div className="leftSide">
          {datasource.map((item) => (
            <div className="component-item " key={item.$name}>
              <div
                draggable="true"
                data-component={item.$component}
                className="draggable-mask ve-dragnode"></div>
              {item.$name}
            </div>
          ))}
        </div>
        <div id="activeArea">
          <div className="blankdiv"></div>
          <canvas id="xCoord"></canvas>
          <canvas id="yCoord"></canvas>
          <div id="cvsarea">
            <canvas id="canvas" width={375} height={720}></canvas>
            <div id="bgcanvas" width={375} height={720}>
              {eles.map((item) => {
                let xCom = factory(item.$component);
                if (!xCom) {
                  return '';
                }
                return (
                  <VisualMask
                    key={item.$id}
                    id={item.$id}
                    selectedId={this.state.selectedId}
                    onSelect={(id) =>
                      this.setState({
                        selectedId: id
                      })
                    }>
                    {React.createElement(
                      xCom,
                      {
                        ...item.$attr,
                        key: item.$id,
                        id: item.$id
                      },
                      item.$name
                    )}
                  </VisualMask>
                );
              })}
            </div>
            <canvas id="coordcanvas" width={375} height={720}></canvas>
            <canvas
              id="topcanvas"
              className="topcanvas"
              width={375}
              height={720}></canvas>
          </div>
        </div>
        <div className="rightSide"></div>
      </div>
    );
  }
}

export default FooPage;
