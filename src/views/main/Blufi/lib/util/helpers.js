export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function longToByteArray(long) {
    // we want to represent the input as a 8-bytes array
    let byteArray = [0, 0, 0, 0, 0, 0, 0, 0];

    for (let index = 0; index < byteArray.length; index++) {
      var byte = long & 0xff;
      byteArray[index] = byte;
      long = (long - byte) / 256;
    }

    return byteArray;
}
