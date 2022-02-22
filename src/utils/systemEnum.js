// 可读 不可以写
function toEnum(obj) {
  // if (_.isEmpty(obj)) {
  //   return;
  // }
  let _data = JSON.parse(JSON.stringify(obj));

  let _obj = {
    _data,
    getLabelByKey: function (key) {
      return (_data[key] || {}).label;
    },
    getLabel: function (val) {
      let keys = Object.keys(_data);
      for (let i = 0; i < keys.length; i++) {
        let x = _data[keys[i]] || {};

        if (x.value == val) {
          return x.label;
        }
      }
      return undefined;
    },
    toArray: function () {
      let arr = [];
      Object.keys(_data).forEach((key) => {
        let xVal = _data[key] || {};
        arr.push({ ...xVal, key: xVal.value });
      });
      return arr;
    },
    render: function (text, record, index) {
      let ret = _obj.getLabel(text);
      if (ret === undefined) {
        ret = text;
      }

      return ret;
    }
  };

  Object.keys(obj).forEach((key) => {
    Object.defineProperty(_obj, key, {
      configrable: false,
      get: function () {
        return _data[key].value;
      },
      set: function (val) {
        // if (!_data[key]) {
        //   _data[key] = {};
        // }
        // _data[key].value = val;
      }
    });
  });

  return _obj;
}

export const originalEnum = toEnum({
  YES: {
    value: 1,
    label: '是'
  },
  NO: {
    value: 0,
    label: '否'
  }
});
