import React, { Component } from 'react';
import { TreeSelect } from 'antd';

import tagGroupService from '@/service/tagCategory';
import tagService from '@/service/tagManage';
import _ from 'lodash';
import { contentQuality, sourceEnum } from '@/utils/systemEnum';

class MetaTreeSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.getTagGroups();
  }

  getTagGroups = async () => {
    const { fetchDataFn } = this.props;
    if (!_.isFunction(fetchDataFn)) {
      return;
    }

    let res = await fetchDataFn();
    if (res?.code == 0) {
      this.setState({
        tagGroupList: res.data || []
      });
    }
  };

  loadData = async (treeNode) => {
    const { loadDataFn } = this.props;
    if (!_.isFunction(loadDataFn)) {
      return;
    }
    let { tagGroupList } = this.state;

    if (treeNode.props.children.length) {
      return;
    }

    let res = await loadDataFn(treeNode);

    if (res?.code == 0) {
      let xChildren = (res.data || []).map((item) => ({
        id: '_' + item.id,
        pId: treeNode.props.value,
        groupName: item.tagName
      }));
      tagGroupList = [...tagGroupList, ...xChildren];

      this.setState({ tagGroupList });
    }
  };
  render() {
    const { placeholder, ...restProps } = this.props;
    return (
      <TreeSelect
        labelInValue
        multiple
        treeCheckable
        treeDataSimpleMode
        showCheckedStrategy={TreeSelect.SHOW_CHILD}
        loadData={this.loadData}
        placeholder="请选择"
        allowClear
        getPopupContainer={(node) => node}
        dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
        treeData={(this.state.tagGroupList || []).map((item) => ({
          id: item.id,
          pId: item.pId || 0,
          value: item.id,
          isLeaf: item.pId > 0,
          checkable: true,
          title: item.groupName
        }))}
        {...restProps}
      />
    );
  }
}

export default MetaTreeSelect;
