import React, { Component } from 'react';
import { Select } from 'antd';
import designerService from '@/service/designer';
import _ from 'lodash';

let Option = Select.Option;

class MetaSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.isUnmounting = false;
    this.getOptions();
  }

  componentWillUnmount() {
    this.isUnmounting = true;
  }

  getOptions = (val = '') => {
    const { searchFn, labelKey } = this.props;
    if (!_.isFunction(searchFn)) {
      return;
    }
    let params = {
      pageNum: 1,
      pageSize: 50
    };
    if (val) {
      params[labelKey] = val;
    }

    searchFn(params).then((res) => {
      if (res?.code == 0) {
        let xData = res.data;
        if (xData?.list) {
          xData = xData.list;
        }
        if (this.isUnmounting) {
          return;
        }
        this.setState({
          dataList: xData || []
        });
      }
    });
  };

  render() {
    const { dataList } = this.state;
    const { searchFn, idKey, labelKey, ...restProps } = this.props;
    return (
      <Select
        showSearch
        labelInValue
        filterOption={false}
        onSearch={this.getOptions}
        {...restProps}
      >
        {(dataList || []).map((item) => (
          <Option value={item[idKey]} key={item[idKey]}>
            {item[labelKey] + `(${item[idKey]})`}
          </Option>
        ))}
      </Select>
    );
  }
}

export default MetaSelect;
