import React from 'react';
import PropTypes from 'prop-types';
// import { Resizable } from 'react-resizable';
import _ from 'lodash';
import cn from 'classnames';
// import 'react-resizable/css/styles.css';
import {
  Table,
  Popover,
  Button,
  Icon,
  Input,
  Select,
  Modal,
  Tooltip,
  Dropdown,
  Checkbox
} from 'antd';
import AutoSizer from 'react-virtualized-auto-sizer';

import ColumnManage from './components/ColumnManage';
import MetaSelect from '../CommonEditor/components/MetaSelect';
import styles from './index.less';
import ColumnSearch from './components/ColumnSearch';

class YlTable extends React.Component {
  static propTypes = {
    dataSource: PropTypes.array,
    pageConditions: PropTypes.object,
    columnData: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
  };

  static defaultProps = {
    pageConditions: {}
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  getSearchDataFrom = (searchData) => {
    if (_.isEmpty(searchData)) {
      return [];
    }
    let ret = [];
    _.keys(searchData).forEach((key, index) => {
      let val = searchData[key];

      if (_.isString(val)) {
        val = {
          label: val,
          fieldDecorator: {}
        };
      }

      if (_.isEmpty(val.fieldDecorator)) {
        val.fieldDecorator = {};
      }

      if (
        _.isFunction(val.getInitialValue) &&
        _.isUndefined(val.fieldDecorator.initialValue)
      ) {
        val.fieldDecorator.initialValue = val.getInitialValue();
      }

      ret.push({
        id: key,
        sort: index,
        ...val
      });
    });

    return ret;
  };

  renderSearch = (searchData) => {
    let items = this.getSearchDataFrom(searchData);

    if (_.isEmpty(items)) {
      return '';
    }

    return (
      <ColumnSearch
        wrappedComponentRef={(ref) => (this.colRef = ref)}
        combineSearchItems={items}
        onSearch={this.handleSearch}
      />
    );
  };

  //暂不需要支持resize
  rewriteComponents = () => {
    const components = {};

    components.header = {
      cell: (props) => {
        const { children, __searchData, style, ...restProps } = props;

        return (
          <th {...restProps} style={{ ...style, position: 'relative' }}>
            {children}
            {!_.isEmpty(__searchData) && (
              <Popover
                placement="bottomRight"
                content={this.renderSearch(__searchData)}
                trigger={['click']}
              >
                <Icon
                  onClick={(evt) => {
                    evt.preventDefault();
                    evt.stopPropagation();
                  }}
                  style={{
                    cursor: 'pointer',
                    position: 'absolute',
                    top: 8,
                    right: 0,
                    padding: '10px'
                  }}
                  type="search"
                />
              </Popover>
            )}
          </th>
        );
      }
    };

    return components;
  };

  /** TODO
   * 1.如过没有固定列 且每列都有宽度 则在当列的总宽度<table宽度的时候 会按照比例放大占满table (默认行为 不用处理)
   * 2.如过没有固定列 且有部分没有宽度 则 没有设置宽度的列平分剩余的宽度 (如果计算后每列动态宽度 < 150 设置为150)
   * 注: 如果有固定列 并且每列都有宽度 当列的总宽度<table宽度的时候会出现断裂
   * 3.如过有固定列 且每列都有宽度 当所有列的宽度 < table宽度 则 将非固定列的宽度 按比例放大
   * 4.如过有固定列 且有部分没有宽度 则没有设置宽度的列平分剩余的宽度 (如果计算后每列动态宽度 < 150 设置为150)
   */
  getColumnsFromModel = (model, tableWidth, options = {}) => {
    const { autoSetColumnTableName } = this.props;
    let { selectable } = options;
    let colsShowable = null;
    if (autoSetColumnTableName) {
      try {
        let xkey = `${autoSetColumnTableName}_COLUMN_SHOW_${_.get(
          window.config,
          'userName',
          ''
        )}`;
        colsShowable = JSON.parse(localStorage.getItem(xkey));
      } catch (e) {}
    }

    let hasFixedCol = selectable;

    if (_.isEmpty(model)) {
      return [];
    }
    let keys = _.keys(model);
    let cols = [];
    let allCols = [];

    keys.forEach((key, index) => {
      let col = model[key];
      if (!_.isObject(col)) {
        col = {
          title: col,
          ellipsis: true,
          width: 150,
          render: (text) => {
            return (
              <Tooltip title={text}>
                <div
                  style={{
                    maxWidth: '100%',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    display: 'inline-block'
                  }}
                >
                  {text}
                </div>
              </Tooltip>
            );
          }
        };
      }

      let p = {
        dataIndex: key,
        key,
        width: 150,
        ...col
      };
      if (!p.title && p.label) {
        p.title = p.label;
      }

      if (p.fixed) {
        hasFixedCol = true;
      }

      if (p.ellipsis) {
        let _render = p.render;
        p.render = (text, record, index) => {
          if (!_render) {
            return (
              <Tooltip title={text}>
                <div
                  style={{
                    width: '100%',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden'
                  }}
                >
                  {text}
                </div>
              </Tooltip>
            );
          }

          let result = _render(text, record, index);
          if (_.isString(result) || _.isNumber(result)) {
            return (
              <Tooltip title={result}>
                <div
                  style={{
                    width: '100%',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden'
                  }}
                >
                  {result}
                </div>
              </Tooltip>
            );
          }

          return result;
        };
      }

      if (p.editable) {
        p.render = (text, record) => {
          if (record.id === this.state.__editItemId) {
            return (
              <div
                style={{
                  margin: '-8px 0',
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'row'
                }}
              >
                {React.createElement(p.editable.control || Input, {
                  defaultValue: text === null || text === undefined ? '' : text,
                  key: p.editable.id,
                  onChange: (evt) => {
                    let val = evt;
                    if (evt.target) {
                      val = evt.target.value;
                    }

                    this.setState({
                      __newValue: val
                    });
                  },
                  ...p.editable.controlProps
                })}
                <Icon
                  type="close"
                  style={{ marginLeft: 5, cursor: 'pointer' }}
                  onClick={() => {
                    this.setState({
                      __editItemId: null,
                      __newValue: null
                    });
                  }}
                />
                <Icon
                  style={{ marginLeft: 5, cursor: 'pointer' }}
                  type="check"
                  onClick={() => {
                    const { __editItemId, __newValue } = this.state;
                    // 如果值未编辑则不发请求
                    if (
                      !__editItemId ||
                      __newValue === null ||
                      __newValue === undefined
                    ) {
                      this.setState({
                        __editItemId: null,
                        __newValue: null
                      });
                      return;
                    }
                    if (!p.editable?.updateFn) {
                      this.setState({
                        __editItemId: null,
                        __newValue: null
                      });
                      return;
                    }
                    let xPromise = p.editable?.updateFn(
                      {
                        id: record.id,
                        [p.key]: __newValue
                      },
                      record
                    );

                    if (xPromise.then) {
                      xPromise.finally(() => {
                        this.setState({
                          __editItemId: null,
                          __newValue: null
                        });
                      });
                    } else {
                      this.setState({
                        __editItemId: null,
                        __newValue: null
                      });
                    }
                  }}
                />
              </div>
            );
          }
          return (
            <div>
              <span>{text}</span>
              <Icon
                style={{ marginLeft: 5, cursor: 'pointer' }}
                type="edit"
                onClick={() => {
                  this.setState({ __editItemId: record.id });
                }}
              />
            </div>
          );
        };
      }

      if (p.searchData) {
        p.onHeaderCell = () => ({
          __searchData: p.searchData
        });
      }

      if (_.isEmpty(colsShowable) || colsShowable.indexOf(p.key) >= 0) {
        cols.push(p);
      }

      allCols.push({
        key: p.key,
        title: p.title
      });
    });

    let colCount = _.countBy(cols, (each) => !each.width);

    let unsetWidthColCount = colCount.true || 0;
    let haswidthColCount = colCount.false || 0;
    let currWidth = _.sumBy(cols, (each) => +each.width || 0);
    let nonFixedWidth = _.sumBy(cols, (each) => {
      if (!each.fixed) {
        return each.width || 0;
      }

      return 0;
    });

    let fixedWidth = _.sumBy(cols, (each) => {
      if (each.fixed) {
        return each.width || 0;
      }

      return 0;
    });

    if (selectable) {
      currWidth += 62; // checkbox列宽
      fixedWidth += 62;
    }

    // 处理 2，4
    if (unsetWidthColCount) {
      let avgWidth = (tableWidth - currWidth) / unsetWidthColCount;

      if (avgWidth < 150) {
        avgWidth = 150;
      }

      cols
        .filter((each) => !each.width)
        .forEach((each, index) => {
          // 最后一列 不设置宽度 自适应 消除计算导致的误差
          if (index !== unsetWidthColCount - 1) {
            each.width = avgWidth;
          }
        });
    } else if (haswidthColCount) {
      // 处理 3

      if (hasFixedCol && currWidth < tableWidth) {
        let rate = (tableWidth - fixedWidth) / nonFixedWidth;
        let tCols = cols.filter((each) => !each.fixed);

        tCols.forEach((each, index) => {
          // 最后一列 不设置宽度 自适应 消除计算导致的误差
          if (index === tCols.length - 1) {
            each.width = undefined;
            delete each.width;
          } else {
            each.width = +(each.width * rate).toFixed(1);
          }
        });
      }
    }

    return { tableColumns: cols, allCols };
  };

  handleSaveTableConfig = (columns) => {
    this.setState({
      columnManagerVisible: false
    });
  };

  render() {
    let {
      scroll,
      columns,
      className,
      dataSource,
      rowSelection,
      onRowDoubleClick,
      pagination,
      isFullScreen,
      rowKey,
      getRowKey,
      columnData,
      autoSetColumnTableName,
      batchOperates,
      ...restProps
    } = this.props;

    /**
     * 父容器会自动添加position: relative的属性
     * 需要手动添加 overflow:hidden属性 否则可能会出现抖动(父容器滚动条导致的)
     * 父级别容器使用flex布局可以动态填满空间
     */

    return (
      <AutoSizer>
        {({ width, height }) => {
          let { tableColumns, allCols } = this.getColumnsFromModel(
            columnData,
            width - 28,
            {
              selectable: !_.isEmpty(rowSelection)
            }
          );

          let xHeight = height - 70;
          if (pagination) {
            xHeight = xHeight - 50;
          }

          if (autoSetColumnTableName) {
            xHeight = xHeight - 50;
          }

          const tableScroll = {
            x: _.sumBy(tableColumns, (each) => each.width || 150),
            y: xHeight
          };

          return (
            <div className="ylTable" style={{ width, height }}>
              <Table
                rowKey={getRowKey || 'id'}
                className={cn('common-table-container', { isFullScreen })}
                columns={tableColumns}
                scroll={tableScroll}
                dataSource={dataSource || []}
                components={this.rewriteComponents()}
                rowSelection={rowSelection}
                pagination={pagination || false}
                {...restProps}
              />
              {!_.isEmpty(batchOperates) && (
                <div className="batch-cmd">
                  <Select
                    placeholder="批量操作"
                    value={this.state.batchOperate}
                    onChange={(evt) => {
                      this.setState({
                        batchOperate: evt
                      });
                    }}
                    style={{ width: '150px', marginRight: '5px' }}
                  >
                    {batchOperates.map((each) => (
                      <Select.Option value={each.operate} key={each.operate}>
                        {each.operateName}
                      </Select.Option>
                    ))}
                  </Select>
                  <Button
                    type="primary"
                    ghost
                    disabled={_.isEmpty(rowSelection?.selectedRowKeys)}
                    onClick={() => {
                      const { rowSelection, onBatchOperate } = this.props;
                      const { batchOperate } = this.state;
                      let _this = this;
                      if (!batchOperate) {
                        return;
                      }

                      if (_.isFunction(onBatchOperate)) {
                        Modal.confirm({
                          title: '确认批量操作数据，不可恢复？',
                          onOk() {
                            onBatchOperate(
                              batchOperate,
                              rowSelection.selectedRowKeys,
                              rowSelection.selectedRows
                            );
                            _this.setState({
                              batchOperate: undefined
                            });
                          }
                        });
                      }
                    }}
                  >
                    确定
                  </Button>
                </div>
              )}
            </div>
          );
        }}
      </AutoSizer>
    );
  }
}

export default YlTable;
