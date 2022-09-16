import React, { Component } from 'react';
import _ from 'lodash';
import CommonEditor, { CommonForm } from './CommonEditor';
import AutoSizer from 'react-virtualized-auto-sizer';
import qs from 'query-string';

import { message, TreeSelect, Input } from 'antd';
import { toJS } from 'mobx';

class DetailPage extends Component {
  constructor(
    props,
    {
      fieldMap, // 字段映射
      pageModule,
      pageTitle,
      primaryKey // 主键
    } = {}
  ) {
    super(props);
    this.state = {};
    this.pageTitle = pageTitle || '';

    /*编辑控件数据源*/
    this.editorData = {};

    this.primaryKey = primaryKey || 'id';
    this.pageModule = pageModule || ''; // 判断编辑和添加是否需要跳转页面
    this.fieldMap = {
      dataList: '$dataList', // 数据源
      currentPage: 'pageNum', // 当前页数
      pageSize: 'pageSize', // 每页条数
      removeId: 'id',
      batchRemoveIds: 'id', // 批量删除时候传参

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
  }

  componentDidMount() {
    this.getDetail();
  }

  handleSave = (params, model) => {
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

    return method(xParams)
      .then((res) => {
        if (!res || +res.code !== 0) {
          throw new Error(_.get(res, 'message') || `${operate}失败`);
        }

        if (res && +res.code === 0) {
          window.localStorage.setItem(`refresh_page`, new Date());
          this.handleClose(res.data);
          return res;
        }
      })
      .catch((e) => {
        // message.warning(e.message || '操作失败');
      });
  };

  getDetail = () => {
    let query = qs.parse(window.location.search.slice(1));
    if (query.id) {
      return this.store[this.fieldMap['storeGetDetail']]({
        [this.primaryKey]: query.id
      }).then((res) => {
        if (res && res.success) {
          this.setState({
            currentModel: res.data
          });
        }
      });
    }
  };

  handleClose = () => {
    window.close();
  };

  render(props) {
    const { currentModel } = this.state;
    const { globalLoading } = this.props;
    let query = qs.parse(window.location.search.slice(1));
    let { postTitle, ...restProps } = {
      ...props,
      ...(this.editorData || {}).editorProps
    };
    let isUpdate = !!query.id;
    let editVisible = query.editType || '';
    let isReadonly = editVisible === 'detail';

    if (_.isEmpty(this.editorData?.data)) {
      return '';
    }

    return (
      <AutoSizer>
        {({ width, height }) => {
          return (
            <div style={{ width, height }}>
              <CommonForm
                title={`${
                  isUpdate ? '编辑' : isReadonly ? '查看' : '添加'
                }${postTitle}`}
                editorData={this.editorData?.data}
                editorMethods={this.editorData?.methods}
                extraButtons={this.editorData?.extraButtons}
                visibled
                colCount={4}
                visibleType={editVisible}
                globalLoading={globalLoading}
                onClose={() => {
                  this.handleClose();
                }}
                onSave={this.handleSave}
                saveHidden={this.editorData?.saveHidden}
                closeHidden={this.editorData?.closeHidden}
                isUpdate={isUpdate}
                isReadonly={isReadonly}
                model={currentModel || {}}
                formItemProps={this.editorData?.formItemProps}
                {...restProps}
              />
              {_.isFunction(this.renderExtra) && this.renderExtra()}
            </div>
          );
        }}
      </AutoSizer>
    );
  }
}

export default DetailPage;
