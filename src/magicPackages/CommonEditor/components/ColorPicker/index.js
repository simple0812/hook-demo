import React, { Component } from 'react';
import { Dropdown, message, Button } from 'antd';
import Icon from '@/components/Icon/AntIcon';
import { SketchPicker } from 'react-color';

import './index.less';

function getRGB(rcolor) {
  let color = parseInt(rcolor.substring(1), 16);
  let r = color >> 16;
  let g = (color - (r << 16)) >> 8;
  let b = color - (r << 16) - (g << 8);
  return [r, g, b];
}

function getColorDifference([r1, g1, b1], [r2, g2, b2]) {
  return Math.abs(r1 - r2) + Math.abs(g1 - g2) + Math.abs(b1 - b2);
}

function isSimilar([r1, g1, b1], [r2, g2, b2]) {
  return Math.abs(r1 - r2) + Math.abs(g1 - g2) + Math.abs(b1 - b2) < 400;
}

class ColorPicker extends Component {
  static getDerivedStateFromProps(props, state) {
    if (props.value !== state.value) {
      if (props.value && props.value.length) {
        return {
          value: props.value
        };
      }
      return {
        value: ''
      };
    }

    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      value: ''
    };
  }

  handleChange = (evt) => {
    const { onChange } = this.props;

    if (onChange) {
      onChange(evt.hex);
    } else {
      this.setState({
        value: evt.hex
      });
    }
  };

  // colorReverse = (oColor) => {
  //   let oldColor = '0x' + oColor.replace(/#/g, '');
  //   let str = '000000' + (0xffffff - oldColor).toString(16);
  //   let newColor = '#' + str.substring(str.length - 6, str.length);

  //   if (isSimilar(getRGB(oColor), getRGB(newColor))) {
  //     console.log('isSimilar');
  //     return '#fff';
  //   }

  //   return newColor;
  // };

  colorReverse = (oColor) => {
    try {
      let xWhite = getColorDifference(getRGB(oColor), getRGB('#ffffff'));
      let xBlack = getColorDifference(getRGB(oColor), getRGB('#000000'));

      return xWhite > xBlack ? '#ffffff' : '#000000';
    } catch (e) {}

    return '#bfbfbf';
  };

  render() {
    const { value } = this.state;

    return (
      <div className="colorPickerCom">
        <Dropdown
          trigger={['click']}
          overlay={
            <SketchPicker color={value} onChangeComplete={this.handleChange} />
          }
        >
          <div
            className="colorPickerCom-content"
            style={{ background: value || '#fff' }}
          >
            <span
              style={{
                marginRight: 5,
                color: value ? this.colorReverse(value) : '#bfbfbf'
              }}
            >
              {value || '请选择颜色'}
            </span>
            {value ? (
              <Icon
                onClick={(evt) => {
                  evt.preventDefault();
                  evt.stopPropagation();
                  this.handleChange('');
                }}
                type="close-circle"
                theme="filled"
                style={{
                  fontSize: 12,
                  color: value
                    ? this.colorReverse(value)
                    : 'rgba(0, 0, 0, 0.25)'
                }}
              />
            ) : (
              <Icon type="down" style={{ color: '#999' }} />
            )}
          </div>
        </Dropdown>
      </div>
    );
  }
}

export default ColorPicker;
