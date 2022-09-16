import moment from 'moment';

export function timeRenderFn(format) {
  format = format || 'YYYY-MM-DD';
  return function (text, record, index) {
    if (!text) return '--';

    return moment(text).format(format);
  };
}

export function emptyRenderFn(emptyHolder) {
  return function (text, record, index) {
    if (!text && text != 0) return emptyHolder || '--';

    return text;
  };
}

export function renderByEnum(enumObj) {
  enumObj = enumObj || {};
  return function (text, record, index) {
    return enumObj[text] || text;
  };
}

export function camelToLinux(str) {
  let reg = /([A-Z]{1})/g;

  if (!str) return str;

  return str.replace(reg, '_$1').toLocaleLowerCase();
}
