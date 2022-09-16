import _ from 'lodash';
import queryString from 'querystring';
import { downloadFile } from '@/magicPackages/utils/download';
import remote from '@/util/Remote';

const { get, post } = remote;

export function getFn(url) {
  return (...params) => {
    return get(url, ...params);
  };
}

export function postFn(url) {
  return (...params) => {
    return post(url, ...params);
  };
}

export function pageDataAdapter(res) {
  // if (res && res.data) {
  //   res.current = res.data.pageNum;
  //   res.pageSize = res.data.pageSize;
  //   res.totalCount = res.data.total;
  //   res.total = res.data.total;
  //   if (res.data && res.data.list) {
  //     res.data = res.data.list;
  //   }
  // }

  return res;
}

export default class BaseService {
  constructor(moduleName = '', apiMap = {}) {
    this.moduleName = moduleName;
    /**
     * url: fn || string  请求地址
     * method: string  请求方法
     * formatParams: fn  参数调整
     */
    let baseApi = {};

    // 如果moduleName为空 则不写入默认的接口
    if (moduleName) {
      baseApi = {
        $getDataList: async (...args) => {
          let res = await post(`${moduleName}/queryPageList.do`, ...args);
          return res;
        },
        $getDetail: (params) => {
          let { id, ...restParams } = params || {};
          return get(`${moduleName}/getById/${id}.do`, restParams);
        },
        create: postFn(`${moduleName}/save.do`),
        update: postFn(`${moduleName}/updateById.do`),
        batchRemove: postFn(`${moduleName}/delete.do`),
        remove: postFn(`${moduleName}/delete.do`),
        export: (params, fileName) => {
          let url = `${moduleName}/export.do`;

          if (!_.isEmpty(params)) {
            url += '?' + queryString.stringify(params);
          }

          downloadFile(url, fileName);
        }
      };
    }

    this.apiMap = {
      ...baseApi,
      ...apiMap
    };

    this.methodMap = {
      get: get,
      post: post
    };

    this.init();
  }

  init = () => {
    _.keys(this.apiMap).forEach((key) => {
      if (!this[key]) {
        if (_.isFunction(this.apiMap[key])) {
          this[key] = this.apiMap[key];
        } else {
          this[key] = (params) => {
            return this.handleRequest(key, params);
          };
        }
      }
    });
  };

  getApi(type = '', params) {
    let xApi = this.apiMap[type] || '';
    if (_.isString(xApi)) {
      return {
        url: xApi
      };
    }

    if (_.isFunction(xApi.url)) {
      return {
        method: xApi.method || 'get',
        url: xApi.url(params),
        formatParams: xApi.formatParams || ''
      };
    }

    return xApi;
  }

  handleRequest = async (type, params) => {
    let xApi = this.getApi(type, params) || {};
    let reqMethod = get;

    if (xApi.method) {
      reqMethod = this.methodMap[xApi.method.toLocaleLowerCase()] || get;
    }

    let xParams = { ...params };
    if (_.isFunction(xApi.formatParams)) {
      xParams = xApi.formatParams({ ...params });
    }
    let res = await reqMethod(xApi.url || '', xParams);
    return res;
  };
}
