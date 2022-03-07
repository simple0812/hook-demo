// 使用装饰器复写方法
export default (fn) => {
  return (target, memberName, propertyDescriptor) => {
    return {
      get() {
        let oldFn = propertyDescriptor.value;

        if (!oldFn && propertyDescriptor.initializer) {
          oldFn = propertyDescriptor.initializer();
        }

        const wrapperFn = (...args) => {
          if (Object.prototype.toString.call(fn) === '[object Function]') {
            fn(...args);
          }

          let ret = oldFn?.apply(this, args);
          return ret;
        };

        Object.defineProperty(this, memberName, {
          value: wrapperFn,
          configurable: true,
          writable: true
        });
        return wrapperFn;
      }
    };
  };
};
