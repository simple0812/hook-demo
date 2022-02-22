import { makeAutoObservable } from 'mobx';

class GlobalStore {
  constructor() {
    makeAutoObservable(this);
  }
  collapse = false;
  locale = 1;

  toggle = () => {
    this.collapse = !this.collapse;
    this.locale += 1;
  };
}

export default new GlobalStore();
