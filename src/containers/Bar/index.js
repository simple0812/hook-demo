// 使用装饰器复写方法
const deprecated = (deprecationReason) => {
  return (target, memberName, propertyDescriptor) => {
    return {
      get() {
        const wrapperFn = (...args) => {
          console.log(
            `Method ${memberName} is deprecated with reason: ${deprecationReason}`
          );
          return propertyDescriptor.value.apply(this, args);
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

  @deprecated('adfasdfds')
  test() {
    console.log('test', this.name);
  }
}

export default function () {
  new Foo('bar').test();
  return <div>Bar</div>;
}
