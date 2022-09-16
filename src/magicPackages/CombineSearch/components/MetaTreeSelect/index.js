import React, { Component } from 'react';
import { TreeSelect } from 'antd';
import cn from 'classnames';
import _ from 'lodash';
import styles from './index.less';

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
    const { loadDataFn, idKey, titleKey } = this.props;
    if (!_.isFunction(loadDataFn)) {
      return;
    }
    let { tagGroupList } = this.state;

    if (treeNode.props.children.length) {
      return;
    }

    let res = await loadDataFn(treeNode, {
      pageNum: 1,
      pageSize: 1000
    });

    if (res?.code == 0) {
      let xChildren = (res.data || []).map((item) => ({
        id: '_' + item[idKey],
        pId: treeNode.props.value,
        [titleKey]: item[titleKey]
      }));
      tagGroupList = [...tagGroupList, ...xChildren];

      this.setState({ tagGroupList });
    }
  };

  render() {
    const { placeholder, idKey, titleKey, className, ...restProps } =
      this.props;
    return (
      <TreeSelect
        labelInValue
        className={cn('bnq_meta_tree_select', className)}
        multiple
        treeCheckable
        treeDataSimpleMode
        showCheckedStrategy={TreeSelect.SHOW_CHILD}
        loadData={this.loadData}
        placeholder="请选择"
        allowClear
        getPopupContainer={(triggerNode) => triggerNode.parentNode}
        dropdownStyle={{ maxHeight: 300, overflow: 'auto', maxWidth: 400 }}
        treeData={(this.state.tagGroupList || []).map((item) => ({
          id: item[idKey],
          pId: item.pId || 0,
          value: item[idKey],
          isLeaf: item.pId > 0,
          checkable: true,
          title: item[titleKey]
        }))}
        {...restProps}
      />
    );
  }
}

export default MetaTreeSelect;
