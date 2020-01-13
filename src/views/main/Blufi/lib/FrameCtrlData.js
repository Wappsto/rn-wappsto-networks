import { BlufiParameter } from './util/params';

const FrameCtrlData = {
  FRAME_CTRL_POSITION_ENCRYPTED: 0,
  FRAME_CTRL_POSITION_CHECKSUM: 1,
  FRAME_CTRL_POSITION_DATA_DIRECTION: 2,
  FRAME_CTRL_POSITION_REQUIRE_ACK: 3,
  FRAME_CTRL_POSITION_FRAG: 4,

  mValue: null,

  setData(frameCtrlValue) {
    this.mValue = frameCtrlValue;
  },

  check(position) {
    return ((this.mValue >> position) & 1) === 1;
  },

  isEncrypted() {
    return this.check(this.FRAME_CTRL_POSITION_ENCRYPTED);
  },

  isChecksum() {
    return this.check(this.FRAME_CTRL_POSITION_CHECKSUM);
  },

  requireAck() {
    return this.check(this.FRAME_CTRL_POSITION_REQUIRE_ACK);
  },

  hasFrag() {
    return this.check(this.FRAME_CTRL_POSITION_FRAG);
  },

  getFrameCTRLValue(encrypted, checksum, direction, requireAck, frag) {
    let frame = 0;
    if (encrypted) {
      frame = frame | (1 << this.FRAME_CTRL_POSITION_ENCRYPTED);
    }
    if (checksum) {
      frame = frame | (1 << this.FRAME_CTRL_POSITION_CHECKSUM);
    }
    if (direction === BlufiParameter.DIRECTION_INPUT) {
      frame = frame | (1 << this.FRAME_CTRL_POSITION_DATA_DIRECTION);
    }
    if (requireAck) {
      frame = frame | (1 << this.FRAME_CTRL_POSITION_REQUIRE_ACK);
    }
    if (frag) {
      frame = frame | (1 << this.FRAME_CTRL_POSITION_FRAG);
    }

    return frame;
  }
}

export default FrameCtrlData;
