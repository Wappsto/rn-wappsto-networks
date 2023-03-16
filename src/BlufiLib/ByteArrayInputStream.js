class ByteArrayInputStream {
  buf = null;
  pos = null;
  mark = null;
  count = null;

  constructor() {
    if (arguments.length === 1) {
      this.ByteArrayInputStream.apply(this, arguments);
    } else {
      this.ByteArrayInputStreamWithArgs.apply(this, arguments);
    }
  }

  ByteArrayInputStream(buf) {
    this.mark = 0;
    this.buf = buf;
    this.count = buf.length;
  }

  ByteArrayInputStreamWithArgs(buf, offset, length) {
    // BEGIN android-note
    // changed array notation to be consistent with the rest of harmony
    // END android-note
    this.buf = buf;
    this.pos = offset;
    this.mark = offset;
    this.count = offset + length > buf.length ? buf.length : offset + length;
  }

  available() {
    return this.count - this.pos;
  }

  close() {
    // Do nothing on close, this matches JDK behavior.
  }

  mark(readlimit) {
    this.mark = this.pos;
  }

  markSupported() {
    return true;
  }

  read() {
    if (arguments.length !== 0) {
      return this._readWithArgs.apply(this, arguments);
    }
    return this._read();
  }

  _read() {
    return this.pos < this.count ? this.buf[this.pos++] & 0xff : -1;
  }

  _readWithArgs(buffer, offset, length) {
    if ((offset | length) < 0 || offset > buffer.length || buffer.length - offset < length) {
      throw new Error(buffer.length, offset, length);
    }
    // Are there any bytes available?
    if (this.pos >= this.count) {
      return -1;
    }
    if (length === 0) {
      return 0;
    }
    let copylen = this.count - this.pos < length ? this.count - this.pos : length;
    //public static void arraycopy(Object src, int srcPos, Object dest, int destPos, int length)
    // Buffer.copy(this.buf, this.pos, buffer, offset, copylen);

    // target, targetStart, sourceStart, sourceEnd
    this.buf.copy(buffer, offset, this.pos, this.pos + copylen);
    this.pos += copylen;
    return copylen;
  }

  reset() {
    this.pos = this.mark;
  }

  skip(byteCount) {
    if (byteCount <= 0) {
      return 0;
    }
    let temp = this.pos;
    this.pos = this.count - this.pos < byteCount ? this.count : this.pos + byteCount;
    return this.pos - temp;
  }
}

export default ByteArrayInputStream;
