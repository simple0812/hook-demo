import { makeAutoObservable } from 'mobx';
import _ from 'lodash';

import globalService from '@/services/global';
import testService from '@/services/test';
import { injectService } from './storeHelper';

class GlobalStore {
  globalLoading = {};
  collapse = false;
  locale = 1;

  constructor() {
    makeAutoObservable(this);
    injectService(globalService, this);
    injectService(testService, this);
  }

  toggle = () => {
    this.collapse = !this.collapse;
    this.locale += 1;
  };

  get double() {
    return this.locale * 2;
  }
}

export default new GlobalStore();
