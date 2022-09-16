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
import styles from './index.less';
import _ from 'lodash';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import searcherFactory from './Searcher';

// 当前页如果含有tabs标签 则在搜索区域不应包含tabs对应的字段 否则会被tabs覆盖
class CombineSearch extends React.Component {
  static propTypes = {
    cmdContainerStyle: PropTypes.object,
    combineSearchItems: PropTypes.array
  };

  static defaultProps = {};

  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      isExpand: false
    };
  }

  /* eslint-disable-next-line */
  handleResize = _.debounce(() => {
    if (!this.isUnmouting) {
      this.setState({});
    }
  }, 500);

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    this.isUnmouting = true;
    window.removeEventListener('resize', this.handleResize);
  }

  handleKeyboard = (evt) => {
    // 当前input被focus则 拦截键盘事件 阻止事件冒泡
    // evt.preventDefault();
    evt.stopPropagation();

    switch (evt.keyCode) {
      case 13:
        this.handleSubmit();
        break;
      default:
        break;
    }
  };

  handleVisibleChange = () => {
    this.setState({ visible: !this.state.visible });
  };

  handleReset = () => {
    this.props.form.resetFields();

    this.handleSubmit();
  };

  getSearchConditions = () => {
    const { combineSearchItems } = this.props;
    var conditions = _.cloneDeep(this.props.form.getFieldsValue());

    _.keys(conditions).forEach((key) => {
      var val = conditions[key];
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

  isExpandable = () => {
    let { combineSearchItems = [] } = this.props;
    let windowWidth =
      document.documentElement.clientWidth || document.body.clientWidth;
    let screenSize = '';

    let sizeMap = {
      xs: 1,
      sm: 1,
      md: 2,
      lg: 3,
      xl: 4,
      xxl: 6
    };

    if (windowWidth < 576) {
      screenSize = 'xs';
    } else if (windowWidth < 768) {
      screenSize = 'sm';
    } else if (windowWidth < 992) {
      screenSize = 'md';
    } else if (windowWidth < 1200) {
      screenSize = 'lg';
    } else if (windowWidth < 2048) {
      // antd默认是 <1600为 xl    但一行显示6个有点挤 顾改成1800
      screenSize = 'xl';
    } else {
      screenSize = 'xxl';
    }

    let rows = (combineSearchItems.length + 1) / sizeMap[screenSize];

    // 超过3行 现在展开/折叠按钮
    return {
      isExpandable: rows > 3,
      countPerRow: sizeMap[screenSize]
    };
  };

  render() {
    let {
      combineSearchItems = [],
      cmdContainerStyle,
      resetButtonHidden
    } = this.props;
    let { isExpand } = this.state;
    let searchItems = _.cloneDeep(combineSearchItems);
    let xStyle = {};

    let { isExpandable, countPerRow } = this.isExpandable();

    if (isExpandable && !isExpand) {
      searchItems = searchItems.slice(0, 3 * countPerRow - 1);
    }

    return (
      <div
        className={classNames(
          'combineSearchCom',
          this.props.className,
          'combine-search-container'
        )}
      >
        <Form className="searchForm" onSubmit={this.handleSubmit}>
          <Row gutter={10} style={{ paddingRight: 5, ...xStyle }}>
            {searchItems.map((source) => {
              source.control = source.control || 'input';
              source.fieldDecorator = source.fieldDecorator || {};

              let searcher = searcherFactory(source.control);
              if (!searcher) return null;

              return searcher.comp(source, this.props);
            })}

            <div
              className="combine-search-cmd-container"
              style={{
                ...cmdContainerStyle,
                float: (searchItems || []).length > 2 ? 'right' : 'left'
              }}
            >
              {!_.isEmpty(searchItems) && (
                <Button type="primary" onClick={this.handleSubmit}>
                  搜索
                </Button>
              )}
              {!_.isEmpty(searchItems) && !resetButtonHidden && (
                <Button
                  className="btn-search_reset"
                  onClick={this.handleReset}
                  style={{ margin: '0 5px' }}
                >
                  重置
                </Button>
              )}

              {this.props.extraButtons}

              {isExpandable && (
                <div
                  style={{
                    cursor: 'pointer',
                    color: '#1890FF',
                    marginLeft: '6px'
                  }}
                  onClick={() => {
                    this.setState({
                      isExpand: !isExpand
                    });
                  }}
                >
                  <span>{isExpand ? '折叠' : '展开'}</span>
                  <Icon
                    style={{ fontSize: 14, color: '#1890FF' }}
                    type={isExpand ? 'up' : 'down'}
                  />
                </div>
              )}
            </div>
          </Row>
        </Form>
      </div>
    );
  }
}

export default Form.create()(CombineSearch);
