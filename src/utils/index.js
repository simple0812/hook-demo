import moment from 'moment';
export const HHMMSS = (value) => {
  var sec_num = Math.floor(Math.max(value, 0));
  var hours = Math.floor(sec_num / 3600);
  var minutes = Math.floor((sec_num - hours * 3600) / 60);
  var seconds = sec_num - hours * 3600 - minutes * 60;

  if (hours < 10) {
    hours = '0' + hours;
  }
  if (minutes < 10) {
    minutes = '0' + minutes;
  }
  if (seconds < 10) {
    seconds = '0' + seconds;
  }
  return minutes + ':' + seconds;
};

export const formatDate = (time, type) => {
  time = moment(time);
  let year = time.get('years'),
    month =
      time.get('months') + 1 < 10
        ? `0${time.get('months') + 1}`
        : time.get('months') + 1,
    day = time.get('date') < 10 ? `0${time.get('date')}` : time.get('date'),
    hours =
      time.get('hours') < 10 ? `0${time.get('hours')}` : time.get('hours'),
    mins =
      time.get('minutes') < 10
        ? `0${time.get('minutes')}`
        : time.get('minutes'),
    ss =
      time.get('seconds') < 10
        ? `0${time.get('seconds')}`
        : time.get('seconds');

  if (type == 'hhmmss') {
    return `${hours}:${mins}:${ss}`;
  }
  if (type == 'YYMMDD') {
    return `${year}-${month}-${day}`;
  }

  return `${year}-${month}-${day} ${hours}:${mins}:${ss}`;
};

export const isEmpty = (str) => {
  return str === null || str === '' || str === undefined;
};

//模拟a标签文件下载
export const downloadFile = (url, filename, suffix) => {
  let a = document.createElement('a');
  document.body.appendChild(a);
  a.style.display = 'none';
  let name = filename;
  if (suffix && suffix !== '') {
    name += suffix;
  }
  a.download = name;
  a.href = url;
  a.click();
  document.body.removeChild(a);
};
