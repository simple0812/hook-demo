import { flow, extendObservable, isObservableProp } from 'mobx';
import _ from 'lodash';

export function injectService(obj, instance) {
  let observableProp = null;
  let methodKeys = filter$Methods(obj);

  for (let i = 0; i < methodKeys.length; i++) {
    let methodName = methodKeys[i];

    if (instance[methodName]) {
      console.warn(`store override service fn ${methodName}`);
      continue;
    }
    // 如果store中包含 service中的同名方法 则跳过
    if (methodName.indexOf('$get') == 0) {
      // 首个字母 小写
      observableProp =
        '$' + methodName[4].toLocaleLowerCase() + methodName.slice(5);

      try {
        if (!isObservableProp(instance, observableProp)) {
          extendObservable(instance, {
            [observableProp]: null
          });
        }
      } catch (e) {}
    }

    instance[methodName] = flowWithLoading.call(
      instance,
      methodName,
      function* gen(...args) {
        const res = yield obj[methodName](...args);
        let { code, data, message } = res || {};

        // 响应异常
        if (+code !== 0) {
          throw new Error(message || '未知错误');
        }

        if (observableProp) {
          this[observableProp] = data;
        }

        // 提示信息
        // if (temp.successMessage) {
        //   if (_.isFunction(temp.successMessage)) {
        //     // message.success(temp.successMessage(data, ...args));
        //   } else {
        //     // message.success(temp.successMessage);
        //   }
        // }

        return res;
      }
    );
  }
}

export function filter$Methods(obj) {
  let xMethods = [];
  function getProperty(new_obj) {
    if (new_obj.__proto__ === null) {
      //说明该对象已经是最顶层的对象
      return [...xMethods];
    }

    let properties = Object.getOwnPropertyNames(new_obj);
    let p = properties.filter(
      (item) => item.startsWith('$') && typeof new_obj[item] === 'function'
    );
    return [...xMethods, ...p, ...getProperty(new_obj.__proto__)];
  }

  return getProperty(obj);
}

export function flowWithLoading(effectName, gen) {
  // 函数重载 如果只有传入了生成器函数
  if (
    Object.prototype.toString.call(effectName) === '[object GeneratorFunction]'
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
    }
  });
}
