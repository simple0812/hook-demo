// 使用装饰器复写方法
const overrideFn = (fn) => {
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

          let ret = oldFn.apply(this, args);
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

class Foo {
  constructor(name) {
    this.name = name;
  }

  get xx() {
    return function (param) {
      console.log('aaaaaaxx' + param);
    };
  }

  @overrideFn(() => {
    console.log('11111111111111');
  })
  test() {
    console.log('test', this.name);
  }

  @overrideFn(() => {
    console.log('2222222222222');
  })
  testXX = () => {
    console.log('testxx');
  };
}

export default function () {
  let xFoo = new Foo('bar');

  xFoo.testXX();
  xFoo.test();
  // xFoo.xx('1234');
  return <div>Bar</div>;
}
