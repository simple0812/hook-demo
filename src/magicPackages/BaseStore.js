import {
  observable,
  flow,
  extendObservable,
  isObservableProp,
  action
} from 'mobx';
import message from '@/components/message';
import _ from 'lodash';
import axios from 'axios';
const CancelToken = axios.CancelToken;

class BaseStore {
  @observable
  globalLoading = {}; // 全局loading

  constructor(service, methods) {
    this.service = service;
    this.cancellers = {};
    this.methods = {
      ...methods
    };

    this.init();
  }

  @action resetList = (dataList = []) => {
    this.$dataList = dataList;
  };

  /* 1.默认读取service的apiMap 为其中的所有方法自动创建store对应的方法
    2.如果方法需要添加一些属性(如observableProp、successMessage：) 请在this.methods中显式配置
 */
  init = () => {
    let xMethods = {};
    // 使用service的配置 自动生成sotre对应方法
    // 如果方法名是以$get开头 如果$getAbcList 则 自动生成 @observable $abcList 的属性
    _.keys(this.service.apiMap || {}).forEach((key) => {
      let observableProp = '';
      if (key.slice(0, 4) === '$get') {
        observableProp = '$' + key[4].toLocaleLowerCase() + key.slice(5);
      }
      xMethods[key] = { serviceMethodName: key, observableProp };
    });

    let tMethods = {
      ...xMethods,
      ...this.methods
    };

    let xVals = _.values(tMethods);

    // 动态添加 observable props
    (xVals || []).forEach((each) => {
      try {
        if (
          each.observableProp &&
          !isObservableProp(this, each.observableProp)
        ) {
          extendObservable(this, {
            [each.observableProp]: null
          });
        }
      } catch (e) {}
    });

    let xKeys = _.keys(tMethods) || [];

    for (let i = 0; i < xKeys.length; i++) {
      let methodName = xKeys[i];

      // 如果存在同名方法 则跳过
      if (_.isFunction(this[methodName])) {
        continue;
      }

      this[methodName] = this.flowWithLoading.call(
        this,
        methodName,
        // eslint-disable-next-line
        function* gen(...args) {
          let temp = tMethods[methodName] || {};
          // 默认service方法与store方法同名
          let sMethod = temp.serviceMethodName || methodName;

          // 暂不支持取消
          // if (temp.cancelable) {
          //   this.cancelRequest(this.cancellers[methodName]);

          // }

          let xService = temp.service || this.service;

          if (!_.isFunction(xService[sMethod])) {
            throw new Error(`${methodName} service.${sMethod} is not function`);
          }

          const res = yield xService[sMethod](...args);
          let { code, data, message: msg } = res || {};

          // 响应异常
          if (+code !== 0) {
            throw new Error(`Response Exception: ${msg};code: ${code}`);
          }

          if (temp.observableProp) {
            if (methodName == '$getDataList') {
              this[temp.observableProp] = data?.list || [];
            } else {
              this[temp.observableProp] = data;
            }
          }

          // 提示信息
          if (temp.successMessage) {
            if (_.isFunction(temp.successMessage)) {
              message.success(temp.successMessage(data, ...args));
            } else {
              message.success(temp.successMessage);
            }
          }

          return res;
        }
      );
    }
  };

  cancelRequest(cancel) {
    if (typeof cancel === 'function') {
      cancel();
    }
  }

  flowWithLoading = (effectName, gen) => {
    // 函数重载 如果只有传入了生成器函数
    if (
      Object.prototype.toString.call(effectName) ===
      '[object GeneratorFunction]'
    ) {
      gen = effectName;
      effectName = 'default';
    }

    effectName = effectName || 'default';
    let _this = this;
    return flow(function* genex(...args) {
      if (_.isObject(_this.globalLoading)) {
        _this.globalLoading = Object.assign({}, _this.globalLoading, {
          [effectName]: 'pending',
          [`${effectName}Error`]: ''
        });
      }

      try {
        const data = yield* gen.call(_this, ...args);

        if (_.isObject(_this.globalLoading)) {
          _this.globalLoading = Object.assign({}, _this.globalLoading, {
            [effectName]: 'done',
            [`${effectName}Error`]: ''
          });
        }

        return data;
      } catch (e) {
        if (_.isObject(_this.globalLoading)) {
          _this.globalLoading = Object.assign({}, _this.globalLoading, {
            [effectName]: 'error',
            [`${effectName}Error`]: e.message || '操作失败'
          });
        }

        return e;
      }
    });
  };
}

export default BaseStore;
