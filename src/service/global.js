import BaseService from './BaseService';
class GlobalService extends BaseService {
  pa = 1;
  pb = 2;
  foo() {}
  bar() {}

  $foo() {}
  $bar() {}

  $getDataList() {
    let mockData = String(Math.random());
    return Promise.resolve({
      code: 0,
      data: [mockData.slice(3, 5), mockData.slice(5, 7), mockData.slice(7, 9)]
    });
  }
}

export default new GlobalService();
