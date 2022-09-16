import _ from 'lodash';
import areaData from '@/util/addressMap';
import store from '@/stores';

function mix(target, source) {
  _.keys(source).map((key) => {
    if (_.has(target, key)) {
      if (_.isObject(source[key])) {
        target[key] = {
          ...target[key],
          ...source[key]
        };
      } else {
        target[key] = source[key];
      }
    } else {
      target[key] = source[key];
    }
  });

  return target;
}

export function cityMixin(source, options) {
  let target = {
    label: '城市',
    control: 'treeSelect',
    options: () => {
      return areaData;
    },
    controlProps: {
      treeDataSimpleMode: false,
      treeCheckStrictly: true,
      treeCheckable: true,
      treeNodeFilterProp: 'title'
    },
    convertToSearchFormat(val) {
      if (!val) {
        return val;
      }
      if (_.isArray(val)) {
        return val.map((item) => item.value); //.join(',');
      }

      return val;
    }
  };
  if (!source) {
    return target;
  }
  return mix(target, source);
}

export function enmuMixin(source, options) {
  let labelKey = options.labelKey || 'name';
  let valueKey = options.valueKey || 'code';
  let target = {
    control: 'select',
    options: () => {
      let globalEnum = store.globalStore?.globalEnum || {};
      let xEnum = globalEnum[options?.enumKey] || [];
      return xEnum.map((item) => ({
        key: item[valueKey],
        value: item[valueKey],
        label: item[labelKey]
      }));
    }
  };
  if (!source) {
    return target;
  }
  return mix(target, source);
}

export function cityEditMixin(source, options) {
  let target = {
    label: '城市',
    // required: true,
    control: 'treeSelect',
    options: () => {
      return areaData;
    },
    controlProps: {
      placeholder: '请选择城市',
      treeDataSimpleMode: false,
      treeCheckStrictly: true,
      treeCheckable: true,
      treeNodeFilterProp: 'title',
      maxTagCount: 10
    },
    fieldDecorator: {
      getValueFromEvent: (values, x, evt) => {
        const { preValue, triggerNode } = evt || {};
        // 当前操作项目是全部
        if (triggerNode?.props?.value == '0') {
          if (_.find(preValue, (item) => item.value == 0)) {
            return [];
          }

          return [{ label: '全国', value: '0' }];
        }
        return values.filter((item) => item.value != 0);
      }
    }
  };
  if (!source) {
    return target;
  }
  return mix(target, source);
}
