// const InputStream =  {
//   initRead(buffer, start, len){
//     this.buffer = buffer;
//     this.index = start;
//     this.len = len;
//   },
//
//   read(){
//     const index = this.index;
//     this.index++;
//     return this.buffer[index];
//   },
//
//   available(){
//     const max = this.len - this.buffer.length;
//     return max - this.index;
//   }
// }
//
// export default InputStream;
