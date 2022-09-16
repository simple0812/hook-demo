import _ from 'lodash';
// 调用的时候 如果需要使用页面的state和props 需要绑定页面  generateEditorFormData.call(this, xxx)
function fn({ editorData, isReadonly } = {}) {
  if (_.isEmpty(editorData)) {
    return [];
  }
  let ret = [];
  _.keys(editorData).forEach((key, index) => {
    let val = _.cloneDeep(editorData[key]);

    if (_.isString(val)) {
      val = {
        label: val,
        fieldDecorator: {},
        controlProps: {
          disabled: isReadonly
        }
      };
    } else {
      val.controlProps = {
        disabled: isReadonly,
        ...val.controlProps
      };
    }

    ret.push({
      id: key,
      sort: index,
      ...val
    });
  });

  return ret;
}

export default fn;
