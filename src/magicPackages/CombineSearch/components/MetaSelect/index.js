import React, { Component } from 'react';
import { Select } from 'antd';
import cn from 'classnames';
import _ from 'lodash';
import remote from '@/util/Remote';

class MetaSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = async (params) => {
    let {
      searchFn,
      apiUrl,
      idKey = 'id',
      labelKey = 'name',
      httpMethod = 'get'
    } = this.props;
    if (!apiUrl) {
      return;
    }

    if (apiUrl) {
      searchFn = remote[(httpMethod || 'get').toLocaleLowerCase()]?.bind(
        remote,
        apiUrl
      );
    }

    let res = await searchFn(params);
    if (res?.code == 0) {
      let xData = res.data;
      if (xData?.list) {
        xData = xData.list;
      }

      this.setState({
        dataList: (xData || []).map((item) => {
          if (_.isObject(item)) {
            return {
              key: item[idKey],
              value: item[idKey],
              label: item[labelKey]
            };
          }

          return {
            key: item,
            value: item,
            label: item
          };
        })
      });
    }
  };

  hanleSearch = (value) => {
    const { searchKey = 'keyword' } = this.props;
    this.fetchData({ [searchKey]: value });
  };

  render() {
    let { placeholder, idKey, labelKey, className, httpMethod, mapIdKey, ...restProps } = this.props;
    const { dataList } = this.state;

    return (
      <Select
        placeholder="请选择"
        showSearch
        allowClear
        onSearch={this.hanleSearch}
        {...restProps}
      >
        {(dataList || []).map((item) => (
          <Select.Option value={item.key} key={item.key}>
            {item.label + `(${item.key})`}
          </Select.Option>
        ))}
      </Select>
    );
  }
}

export default MetaSelect;
