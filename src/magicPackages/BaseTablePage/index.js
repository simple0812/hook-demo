/**
 * 覆写基类方式的时候 如果需要先调用基类的方法 有2中模式
 * 1.在constructor中 定义一个变量指向基类的方法 在覆写方法里面调用该变量
 * 2.基类方法使用具名函数(如生命周期函数) 子类覆写时候使用super.methodName()调用。(箭头函数是匿名函数 不可使用)
 * 3.覆写时 如不需调用基类方法 可随意发挥
 */
import React, { Component } from 'react';
import _ from 'lodash';
import qs from 'qs';
import { Modal } from 'antd';
import { toJS } from 'mobx';
import Popconfirm from '@/components/Popconfirm';
import { downloadFile } from '@/magicPackages/utils/download';
import CombineSearch from '../CombineSearch';
import CommonEditor from '../CommonEditor';
import message from '@/components/message';
import Table from '../YlTable';

export default class BaseTablePage extends Component {
  // table查询条件分为3部分 searchConditions queryConditions pageConditions
  constructor(
    props,
    {
      pageActions, // 页面操作
      fieldMap, // 字段映射
      primaryKey, // 主键
      pageModule,
      initSearchConditions, // 初始查询条件
      queryConditions, // 其他参数(如url传递过来的)
      pageConditions //分页参数
    } = {}
  ) {
    super(props);
    this.primaryKey = primaryKey || 'id';
    this.pageModule = pageModule || ''; // 判断编辑和添加是否需要跳转页面
    this.initSearchConditions = {
      ...initSearchConditions
    };
    this.pageActions = {
      create: true, // 添加
      update: true, // 编辑
      remove: true, // 删除
      multipleRemove: true, // 批量删
      showDetail: false, //详情
      getDetailFromApi: false, // 编辑或者查看详情的时候 详情的数据是否通过接口获取(默认从表的数据源中获取)
      hasPagination: true, // 是否有分页组件
      selectable: false, // table是否支持多选
      useCommonDrawer: true, // 查看详情和编辑组件是否使用相同的组件
      frontPage: false, // 前端分页
      ...pageActions
    };

    this.fieldMap = {
      dataList: '$dataList', // 数据源
      currentPage: 'pageNum', // 当前页数
      pageSize: 'pageSize', // 每页条数
      removeId: primaryKey || 'id',
      batchRemoveIds: primaryKey || 'id', // 批量删除时候传参
      detailVisibleKey: this.pageActions.useCommonDrawer
        ? 'editVisible'
        : 'detailVisible',

      // store里面的方法映射
      storeGetDataList: '$getDataList',
      storeRemove: 'remove',
      storeUpdate: 'update',
      storeCreate: 'create',
      storeGetDetail: '$getDetail',
      sortBy: 'sortBy',
      sort: 'sort',
      ...fieldMap
    };

    this.state = {
      editVisible: false, //编辑框是否可见
      searchConditions: {
        ...initSearchConditions
      },
      queryConditions: {
        ...queryConditions
      },
      pageConditions: {
        pageSize: 10,
        current: 1,
        total: 1,
        ...pageConditions
      }
    };
  }

  handleSearch = (evt) => {
    const { pageConditions } = this.state;
    pageConditions.current = 1;
    this.setState(
      {
        searchConditions: evt || {},
        pageConditions,
        selectedRowKeys: []
      },
      () => {
        this.fetchData();
      }
    );
  };

  handlePageChange = ({ current, pageSize } = {}, filters, sorter) => {
    const { pageConditions } = this.state;

    pageConditions.current = current;
    pageConditions.pageSize = pageSize;
    pageConditions.sortBy = _.get(sorter, 'field') || '';
    pageConditions.sort = _.get(sorter, 'order') || ''; // 'descend', 'ascend'
    this.setState(
      {
        pageConditions
      },
      () => {
        if (!this.pageActions.frontPage) {
          this.fetchData();
        }
      }
    );
  };

  handleExport = (api, fileName, options) => {
    let { orderBy, orderByStr, pageNum, pageSize, ...rest } =
      this.getSearchConditions();

    downloadFile(api, fileName, {
      method: 'post',
      data: {
        ...rest
      },
      ...options
    });
  };

  // 列表搜索参数由3部分构成 分页参数、搜索参数、其他参数(如url传递过来的)
  getPageParams = () => {
    let {
      pageConditions: { current, pageSize, sort, sortBy } = {},
      searchConditions,
      queryConditions
    } = this.state;

    let xParams = {
      ...searchConditions,
      ...queryConditions
    };

    xParams[this.fieldMap.currentPage] = current;
    xParams[this.fieldMap.pageSize] = pageSize;

    if (sort || sort === 0) {
      xParams[this.fieldMap.sortBy] = sortBy;
      xParams[this.fieldMap.sort] = sort === 'descend' ? 0 : 1;
    }

    if (_.isFunction(this.searchData.searchProps?.formatParam)) {
      return this.searchData.searchProps?.formatParam(xParams);
    }

    return xParams;
  };

  getSearchConditions = () => {
    if (
      this.combineSearchRef &&
      _.isFunction(this.combineSearchRef.getSearchConditions)
    ) {
      return this.combineSearchRef.getSearchConditions();
    }

    return {};
  };

  fetchData = () => {
    let { pageConditions = {} } = this.state;
    let xParams = this.getPageParams();

    if (!this.store) {
      throw new Error('store is undefined');
    }

    this.store[this.fieldMap['storeGetDataList']]({ ...xParams })
      .then((res) => {
        pageConditions.total =
          (res?.data?.total !== undefined
            ? res?.data?.total
            : pageConditions.total) || 0;
        this.setState({
          selectedRowKeys: [],
          pageConditions
        });

        return res;
      })
      .catch((e) => {});
  };

  getDetail = (record) => {
    if (this.pageActions.getDetailFromApi) {
      return this.store[this.fieldMap['storeGetDetail']]({
        [this.primaryKey]: record[this.primaryKey]
      }).then((res) => {
        if (res && res.success) {
          return Promise.resolve({ ...record, ...res.data });
        }
        throw new Error(_.get(res, 'message') || '获取详情失败');
      });
    }

    return Promise.resolve(record);
  };

  handleRemove = (record) => {
    if (!this.store) {
      throw new Error('store is undefined');
    }
    const { pageConditions } = this.state;
    this.store[this.fieldMap['storeRemove']]({
      [this.fieldMap.removeId]: record[this.primaryKey]
    }).then((res) => {
      if (res && +res.code === 0) {
        // pageConditions.current = 1;
        message.success('删除成功');
        this.setState(
          {
            selectedRowKeys: [],
            pageConditions
          },
          this.fetchData
        );
      }
    });
  };

  handleBatchRemove = () => {
    if (!this.store) {
      throw new Error('store is undefined');
    }
    const { pageConditions, selectedRowKeys } = this.state;
    if (_.isEmpty(selectedRowKeys)) {
      return message.warning('请选择需要删除的项目');
    }
    let _this = this;

    Modal.confirm({
      title: '确定要删除选中的项目?',
      onOk() {
        _this.store[_this.fieldMap['storeRemove']]({
          [_this.fieldMap.batchRemoveIds]: (selectedRowKeys || []).join(',')
        }).then((res) => {
          if (res && +res.code === 0) {
            pageConditions.current = 1;
            message.success('删除成功');
            _this.setState(
              {
                selectedRowKeys: [],
                pageConditions
              },
              _this.fetchData
            );
          }
        });
      },
      onCancel() {}
    });
  };

  handleShowEdit = (record) => {
    if (!this.pageModule) {
      this.handleShowEditex(record);
      return;
    }

    let xId = '';

    if (record && record[this.primaryKey]) {
      xId = record[this.primaryKey];
    }
    let xUrl = `/${this.pageModule}/detail?id=${xId}`;

    this.props.history.push(xUrl);
    // window.open(xUrl);
  };

  handleShowEditex = (record) => {
    if (_.isFunction(this.editorData.methods?.beforeShow)) {
      this.editorData.methods.beforeShow(record);
    }
    if (!this.pageActions.getDetailFromApi) {
      this.setState({
        currentModel: record,
        editVisible: _.isEmpty(record) ? 'create' : 'update'
      });

      return;
    }

    this.setState({
      editVisible: _.isEmpty(record) ? 'create' : 'update'
    });

    // 添加的时候 要清空历史缓存
    if (_.isEmpty(record)) {
      this.setState({
        currentModel: null
      });
      return;
    }

    this.getDetail(record)
      .then((res) => {
        this.setState({
          currentModel: res
        });
      })
      .catch((err) => {
        message.warning(err.message || '获取详情失败');
      });
  };

  handleSave = (params, model) => {
    const { pageConditions = {} } = this.state;

    let method = this.store[this.fieldMap['storeCreate']];
    let operate = '添加';
    let xParams = { ...params };

    let isUpdate = model && model[this.primaryKey];

    // 根据是否含有主键来判断是新增还是更新
    if (isUpdate) {
      method = this.store[this.fieldMap['storeUpdate']];
      xParams[this.primaryKey] = model[this.primaryKey];
      operate = '编辑';
    }

    return method(xParams).then((res) => {
      if (!res || +res.code !== 0) {
        throw new Error(_.get(res, 'message') || `${operate}失败`);
      }
      if (res && +res.code === 0) {
        this.handleClose();
        if (!isUpdate) {
          pageConditions.current = 1;
        }
        message.success(`${operate}成功`);
        this.setState(
          {
            pageConditions
          },
          () => {
            this.fetchData();
          }
        );
      }

      return res;
    });
  };

  // 更新操作后,需要重置查询
  initSearch = () => {
    const { pageConditions = {} } = this.state;
    pageConditions.current = 1;
    this.setState(
      {
        pageConditions
      },
      () => {
        this.fetchData();
      }
    );
  };

  // 关闭编辑页面后 需要重置currentModel
  handleClose = () => {
    let { editVisible } = this.state;
    let obj = {
      editVisible: !editVisible
    };

    if (editVisible) {
      obj.currentModel = null;
    }
    this.setState(obj);
  };

  handleShowDetail = (record) => {
    if (_.isEmpty(record)) {
      return;
    }

    if (this.pageModule) {
      let xId = '';

      if (record && record[this.primaryKey]) {
        xId = record[this.primaryKey];
      }
      let xUrl = `/${this.pageModule}/detail?id=${xId}&editType=detail`;
      this.props.history.push(xUrl);
      return;
    }

    if (!this.pageActions.getDetailFromApi) {
      this.setState({
        currentModel: record,
        [this.fieldMap.detailVisibleKey]: 'detail'
      });

      return;
    }

    this.setState({
      [this.fieldMap.detailVisibleKey]: 'detail'
    });

    this.getDetail(record)
      .then((res) => {
        this.setState({
          currentModel: res
        });
      })
      .catch((err) => {
        message.warning(err.message || '获取详情失败');
      });
  };

  getOperateColumn = () => {
    if (
      !this.pageActions.update &&
      !this.pageActions.remove &&
      !this.pageActions.showDetail &&
      !_.isFunction(this.columnData?.operateColumnProps?.getExtraOperateColumns)
    ) {
      return;
    }

    let operateColumnProps = { ...this.columnData?.operateColumnProps };
    let col = {
      title: '操作',
      dataIndex: 'optionColumn',
      fixed: _.isUndefined(operateColumnProps.fixed)
        ? 'right'
        : operateColumnProps.fixed,
      key: 'optionColumn',
      width: _.get(operateColumnProps, 'width') || 150,
      render: (text, record, index) => {
        return (
          <span className="table_operation">
            {_.isFunction(this.handleShowDetail) &&
              this.pageActions.showDetail && (
                <span
                  style={{
                    margin: '0 5px',
                    cursor: 'pointer',
                    color: '#00B9EF'
                  }}
                  onClick={this.handleShowDetail.bind(this, record)}
                >
                  查看
                </span>
              )}
            {_.isFunction(this.handleShowEdit) && this.pageActions.update && (
              <span
                style={{ margin: '0 5px', cursor: 'pointer', color: '#00B9EF' }}
                onClick={this.handleShowEdit.bind(this, record)}
              >
                编辑
              </span>
            )}
            {_.isFunction(this.handleRemove) && this.pageActions.remove && (
              <Popconfirm
                title="提示"
                content={operateColumnProps.removeText || '确定删除？'}
                onOk={this.handleRemove.bind(this, record)}
                okText="确定"
                cancelText="取消"
              >
                <span
                  style={{
                    margin: '0 5px',
                    cursor: 'pointer',
                    color: '#00B9EF'
                  }}
                >
                  删除
                </span>
              </Popconfirm>
            )}
            {_.isFunction(operateColumnProps.getExtraOperateColumns) &&
              operateColumnProps.getExtraOperateColumns(text, record, index)}
          </span>
        );
      }
    };

    return col;
  };

  renderTable = ({
    resizable,
    scroll,
    isFullScreen,
    rowSelection,
    ...restProps
  } = {}) => {
    const { globalLoading } = this.store;
    const { pageConditions: { current, pageSize, total } = {} } = this.state;

    if (this.pageActions.selectable && _.isEmpty(rowSelection)) {
      rowSelection = {
        fixed: true,
        selectedRowKeys: this.state.selectedRowKeys,
        selectedRows: this.state.selectedRows,
        onChange: (selectedRowKeys, selectedRows) => {
          this.setState({ selectedRowKeys, selectedRows });
        }
      };
    }
    let xDataSource = toJS(this.store[this.fieldMap.dataList]);

    let xColumnData = this.columnData?.data || {};

    let operateCol = this.getOperateColumn({});

    if (operateCol) {
      xColumnData.optionColumn = operateCol;
    }

    let extraProps = { ...this.columnData?.tableProps };

    let tableProps = {
      dataSource: xDataSource,
      resizable: !!resizable,
      loading: globalLoading[this.fieldMap['storeGetDataList']] === 'pending',
      isFullScreen: !!isFullScreen,
      onChange: this.handlePageChange,
      rowSelection,
      getRowKey: this.primaryKey,
      columnData: xColumnData,
      batchOperates: this.pageActions.batchOperates,
      onBatchOperate: this.handleBatchOperate,

      // 没有数据不显示分页插件
      pagination:
        _.isEmpty(xDataSource) || !this.pageActions.hasPagination
          ? false
          : {
              current: current,
              pageSize: pageSize,
              total: total,
              size: 'small',
              showQuickJumper: true,
              showSizeChanger: true,
              hideOnSinglePage: false,
              showTotal: (total) => `共 ${total} 条`
            },
      ...extraProps,
      ...restProps
    };

    return <Table {...tableProps} />;
  };

  renderSearch = () => {
    let props = {};

    props = {
      ...props,
      ...this.searchData?.searchProps
    };

    return (
      <CombineSearch
        wrappedComponentRef={(ref) => (this.combineSearchRef = ref)}
        searchData={this.searchData?.data}
        onSearch={this.handleSearch}
        {...props}
      />
    );
  };

  checkIsUpdate = () => {
    const { currentModel, editVisible } = this.state;
    // return !!_.get(currentModel, this.primaryKey);

    return editVisible === 'update';
  };

  renderEditor = (props) => {
    const { editVisible, currentModel } = this.state;
    const { globalLoading } = this.props;
    let { postTitle, ...restProps } = {
      ...props,
      ...(this.editorData || {}).editorProps
    };
    let isUpdate = this.checkIsUpdate();
    let isReadonly = editVisible === 'detail';

    if (_.isEmpty(this.editorData?.data)) {
      return '';
    }

    return (
      <CommonEditor
        title={`${
          isUpdate ? '编辑' : isReadonly ? '查看' : '添加'
        }${postTitle}`}
        // editorItems={items}
        editorData={this.editorData?.data}
        editorMethods={this.editorData?.methods}
        visible={!!editVisible}
        visibleType={editVisible}
        globalLoading={globalLoading}
        onClose={this.handleClose}
        onSave={this.handleSave}
        isUpdate={isUpdate}
        ref={(ref) => (this.$editorRef = ref)}
        isReadonly={isReadonly}
        model={currentModel || {}}
        {...restProps}
      />
    );
  };
}
