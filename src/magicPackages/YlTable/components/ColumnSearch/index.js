/**
 * tableTime: {
    label: '发起时间',
    control: 'rangePicker', // 组件类型

    startKey: 'startTime', //control=rangePicker 特有
    endKey: 'endTime', //control=rangePicker 特有

    minKey: 'min', //control=rangeNumber 特有
    maxKey: 'max', //control=rangeNumber 特有

    options: [], //control=select 等特有 可以是函数和数组
    showAllOption: false, // control=select 等特有 是否添加 ‘全部’

    fieldDecorator: {  // form表单的属性 
      initialValue: [] // 设置组件的初始化值 建议通过getInitialValue设置
    },

    getInitialValue: null, // 将初始搜索条件转为组件初始值 函数 
    convertToSearchFormat:(val, key) => { // 将组件的值转化为搜索时需要的格式
      if (!moment.isMoment(val)) {
        return val;
      }

      let timeFormat = key === 'startTime' ? '00:00:00' : '23:59:59';
      return val.format(`YYYY-MM-DD ${timeFormat}`)
    },

    colProps: {}, // 组件Col的属性 用于控制组件宽度
    labelStyle: {}, // 设置label的样式,
    wrapperStyle: {}, // 设置组件容器的样式
    
    controlProps: { // 组件属性
      style: { width: 250 },
      format: 'YYYY-MM-DD'
    }
  }
*/

import React from 'react';
import { Form, Row, Button, Icon } from 'antd';
import _ from 'lodash';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import './index.less';

import searcherFactory from '../../../CombineSearch/Searcher';

// 当前页如果含有tabs标签 则在搜索区域不应包含tabs对应的字段 否则会被tabs覆盖
class CombineSearch extends React.Component {
  static propTypes = {
    cmdContainerStyle: PropTypes.object,
    combineSearchItems: PropTypes.array
  };

  static defaultProps = {};

  constructor(props) {
    super(props);

    this.state = {};
  }

  handleReset = () => {
    this.props.form.resetFields();
  };

  getSearchConditions = () => {
    const { combineSearchItems } = this.props;
    const conditions = _.cloneDeep(this.props.form.getFieldsValue());

    _.keys(conditions).forEach((key) => {
      const val = conditions[key];
      let searcherData =
        _.find(combineSearchItems, (each) => each.id === key) || {};

      let searcher = searcherFactory(searcherData.control);
      if (searcher) {
        conditions[key] = searcher.parseValue(val, searcherData, {
          props: this.props,
          conditions,
          key
        });
      }
    });

    let xPrams = _.omitBy(conditions, _.isUndefined);
    return xPrams;
  };

  handleSubmit = () => {
    let xPrams = this.getSearchConditions();

    if (this.props.onSearch) {
      this.props.onSearch(xPrams);
    }
  };

  render() {
    let { combineSearchItems = [], cmdContainerStyle } = this.props;
    let searchItems = _.cloneDeep(combineSearchItems);
    let xStyle = {};

    return (
      <div className="columnSearchCom">
        <Form className="searchForm" onSubmit={this.handleSubmit}>
          <Row gutter={10} style={{ ...xStyle }}>
            {searchItems.map((source) => {
              source.control = source.control || 'input';
              source.fieldDecorator = source.fieldDecorator || {};
              source.colProps = { span: 24, ...source.colProps };

              let searcher = searcherFactory(source.control);
              if (!searcher) return null;

              return searcher.comp(source, this.props);
            })}

            <div
              className="combine-search-cmd-container"
              style={{
                ...cmdContainerStyle
              }}
            >
              <Button
                className="btn-search_reset"
                onClick={this.handleReset}
                style={{ margin: '0 5px' }}
              >
                重置
              </Button>
              <Button type="primary" onClick={this.handleSubmit}>
                搜索
              </Button>
            </div>
          </Row>
        </Form>
      </div>
    );
  }
}

export default Form.create()(CombineSearch);
