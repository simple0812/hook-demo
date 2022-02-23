function Foo() {
  this.bar = 'abc';
}

Foo.getInstance = function () {
  if (Foo.__instance) {
    return Foo.__instance;
  }
  return (Foo.__instance = new Foo());
};

export default Foo;
