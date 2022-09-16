import overrideFn from '@/utils/overrideFn';

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
