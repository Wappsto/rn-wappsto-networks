class LinkedBlockingQueue {
  constructor() {
    this.waiting = [];
    this.queue = [];
  }

  add(cell) {
    if(this.waiting){
      this.waiting[0].resolve(cell);
      clearTimeout(this.waiting[0].timeout);
      this.waiting.shift();
    } else {
      this.queue.push(cell);
    }
  }

  take() {
    if(this.queue.length > 0){
      return this.queue.shift();
    }
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject('timeout');
      }, 5000);
      this.waiting.push({ resolve, reject, timeout });

    });
  }

  clear(){
    this.queue = [];
    this.waiting.forEach(({ reject }) => reject('clear'));
    this.waiting = [];
  }
}

export default LinkedBlockingQueue;
