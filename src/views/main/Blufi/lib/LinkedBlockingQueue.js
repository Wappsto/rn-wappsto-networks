class LinkedBlockingQueue {
  constructor() {
    this.waiting = [];
    this.queue = [];
  }

  add(cell) {
    if(this.waiting){
      this.waiting[0].resolve(cell);
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
      this.waiting.push({ resolve, reject });
      setTimeout(() => {
        reject('timeout');
      }, 5000);
    });
  }

  clear(){
    this.queue = [];
    this.waiting.forEach(({ reject }) => reject('clear'));
    this.waiting = [];
  }
}

export default LinkedBlockingQueue;
