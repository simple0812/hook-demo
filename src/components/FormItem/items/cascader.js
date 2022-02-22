import React, { useState, useEffect } from 'react';
import { Cascader } from 'antd';
import mobxInjectStore from '@/utils/mobxInjectStore';

const BCascader = (props) => {
  const {
    globalStore,
    name,
    placeholder,
    disabled,
    defaultOptions = [],
    value,
    onChange
  } = props;
  // console.log('props', props);
  const [options, setOptions] = useState(defaultOptions);

  //获取所有的省份
  useEffect(() => {
    const getAllProvince = async () => {
      const res = await globalStore.$getAllProvince();
      if (res?.code === 0) {
        let { data } = res;
        data = data.map((item) => {
          return {
            label: item.provinceName,
            value: item.provinceCode,
            isLeaf: false
          };
        });
        setOptions(data);
      }
    };
    // 获取所有的省份
    if (!disabled) {
      getAllProvince();
    }
  }, [disabled, globalStore]);

  const onChangeCascader = (value, selectedOptions) => {
    //console.log(props);
    //console.log(value, selectedOptions);
    selectedOptions = selectedOptions.map((item) => {
      return {
        label: item.label,
        value: item.value
      };
    });
    props.onChange(selectedOptions);
  };

  const displayRender = (value, selectedOptions) => {
    //console.log('xxxxxxxxx', value, selectedOptions);
    let formatLabel = value.reduce((prev, cur) => {
      return prev + cur.label + '/';
    }, '');
    formatLabel = formatLabel.substr(0, formatLabel.length - 1);
    return formatLabel;
  };

  const loadData = async (selectedOptions) => {
    //console.log('selectedOptions', selectedOptions);

    const len = selectedOptions.length;
    const targetOption = selectedOptions[len - 1];
    targetOption.loading = true;

    let res = null;
    if (len === 1) {
      //根据省份 获取城市列表
      res = await globalStore.$getCityListByProvinceCode({
        provinceCode: targetOption.value
      });
    } else if (len === 2) {
      //根据城市 获取区
      res = await globalStore.$getAreaListByCityCode({
        cityCode: targetOption.value
      });
    } else if (len === 3) {
      //根据区 获取街道
      res = await globalStore.$getStreetListByAreaCode({
        areaCode: targetOption.value
      });
    }

    targetOption.loading = false;
    if (res?.code === 0) {
      let { data } = res;
      data = data.map((item) => {
        return {
          label: item.cityName || item.areaName || item.streetName,
          value: item.cityCode || item.areaCode || item.streetCode,
          isLeaf: item.streetCode ? true : false
        };
      });
      targetOption.children = data;
      setOptions([...options]);
    }
  };
  return (
    <Cascader
      name={name}
      disabled={disabled}
      options={options}
      loadData={loadData}
      changeOnSelect
      onChange={onChangeCascader}
      value={value}
      displayRender={displayRender}
      placeholder={placeholder}
    />
  );
};
export default mobxInjectStore('globalStore')(BCascader);
