import React, { Component } from 'react';
import { Select } from 'antd';
import _ from 'lodash';
import remote from '@/util/Remote';

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
    let { searchFn, labelKey, apiUrl, httpMethod = 'get' } = this.props;
    if (!_.isFunction(searchFn) && !apiUrl) {
      return;
    }

    if (apiUrl) {
      searchFn = remote[(httpMethod || 'get').toLocaleLowerCase()]?.bind(
        remote,
        apiUrl
      );
    }

    let params = {
      pageNum: 1,
      pageSize: 50
    };
    if (val) {
      params[labelKey || 'name'] = val;
    }

    console.log('zzz', searchFn);


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
    let { searchFn, idKey, labelKey, ...restProps } = this.props;
    if (!idKey) {
      idKey = 'id';
    }
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
            {item[labelKey || 'name'] + `(${item[idKey]})`}
          </Option>
        ))}
      </Select>
    );
  }
}

export default MetaSelect;
