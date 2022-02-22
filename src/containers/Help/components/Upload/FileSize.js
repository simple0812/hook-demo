export default class FileSize {
  constructor(size) {
    this.size = (size || '').toLocaleUpperCase();
  }

  toNumber() {
    let unit = this.size.slice(-1);
    let val = this.size.slice(0, -1);

    if (unit == 'K') {
      return val * 1024;
    }

    if (unit == 'M') {
      return val * 1024 * 1024;
    }

    if (unit == 'G') {
      return val * 1024 * 1024 * 1024;
    }

    return +this.size || 0;
  }
}
