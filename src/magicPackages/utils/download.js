import axios from 'axios';
import message from '@/components/message';

export const getFileName = (url) => {
  let path = url.split('?')[0];
  return path.split(/[\\/]/gi).slice(-1)[0];
};

export const downloadFile = (url, name, options = {}) => {
  let xFileName = name;
  if (!name) {
    xFileName = getFileName(url);
  }
  let xToken = localStorage.getItem('accessToken') || '';
  let { headers, ...restOptions } = options;

  axios({
    method: options?.method || 'get',
    url,
    responseType: 'blob', //重要
    params: { _cache: Date.now() },
    headers: {
      token: xToken,
      ...headers
    },
    ...restOptions
  })
    .then((response) => {
      if (response?.status !== 200) {
        message.error('下载失败');
        return;
      }

      // 处理导出失败的时候 服务端返回json数据
      if (response.data.type === 'application/json') {
        try {
          var reader = new FileReader();
          reader.readAsText(response.data, 'utf-8');
          reader.onload = function () {
            try {
              let res = JSON.parse(reader.result);
              message.error(res.message || '下载失败');
            } catch (e) {}
          };
        } catch (e) {
          message.error('下载失败');
        }
        return;
      }

      // 如果没有提供文件名 解析服务端提供的文件名
      if (
        !xFileName &&
        response.headers &&
        response.headers['content-disposition']
      ) {
        let reg = /attachment; filename="([^"]+)"/gi;
        let ret = response.headers['content-disposition'].match(reg);
        if (ret) {
          xFileName = RegExp.$1;
        }
      }

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', xFileName);
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
    })
    .catch((e) => {
      message.error(e.message || '下载失败');
    });
};
