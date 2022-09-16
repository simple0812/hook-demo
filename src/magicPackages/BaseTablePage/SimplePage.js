import React from 'react';
import _ from 'lodash';
import { Button } from 'antd';
import cn from 'classnames';
import { toJS } from 'mobx';

import BaseTablePage from './index';

import './page.less';

// 注：继承SimplePage后 一定要传入store 并且赋值给this.store
class SimplePage extends BaseTablePage {
  constructor(props, initOptions) {
    let xInitOptions = {
      fieldMap: {
        batchRemoveIds: 'id'
      },
      primaryKey: 'id',
      initSearchConditions: {},
      pageActions: {},
      ...initOptions
    };

    super(props, xInitOptions);

    this.state = {
      ...this.state
    };
  }

  componentDidMount() {
    this.fetchData();

    window.addEventListener('storage', (evt) => {
      if (evt?.key === `refresh_page`) {
        this.fetchData();
      }
    });
  }

  renderExtraButtons = () => {};

  render() {
    return (
      <div className={cn('simplePage', this.pageClass)}>
        {_.isFunction(this.renderHeader) && this.renderHeader()}
        <div className="header-search">
          <div className="header-search__left"></div>
          <div className="header-search__right">{this.renderSearch()}</div>
        </div>

        <div className="table-head">
          <div className="table-head__left">{this.pageTitle}</div>
          <div className="table-head__right">
            {this.renderExtraButtons()}
            {this.pageActions.create && (
              <Button
                type="primary"
                style={{ marginLeft: 5 }}
                onClick={this.handleShowEdit.bind(this, null)}
              >
                添加
              </Button>
            )}
          </div>
        </div>

        <div className="page-body">
          {this.renderTable({
            isFullScreen: true // autosizer 需要配合position:relative使用
          })}
        </div>
        {this.renderEditor({
          postTitle: this.pageTitle || ''
        })}
        {_.isFunction(this.renderExtra) && this.renderExtra()}
      </div>
    );
  }
}

export default SimplePage;
