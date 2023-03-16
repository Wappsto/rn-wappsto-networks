class LinkedBlockingQueue {
  constructor() {
    this.waiting = [];
    this.queue = [];
  }

  add(cell) {
    if (this.waiting.length > 0) {
      this.waiting[0].resolve(cell);
      clearTimeout(this.waiting[0].timeout);
      this.waiting.shift();
    } else {
      this.queue.push(cell);
    }
  }

  take() {
    if (this.queue.length > 0) {
      return this.queue.shift();
    }
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        resolve('');
      }, 10000);
      this.waiting.push({ resolve, reject, timeout });
    });
  }

  clear() {
    this.waiting.forEach(({ resolve }) => resolve(''));
    this.waiting = [];
    this.queue = [];
  }
}

export default LinkedBlockingQueue;
