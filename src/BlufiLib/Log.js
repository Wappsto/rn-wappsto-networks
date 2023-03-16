let isDebugEnabled = false;
const Log = {
  w() {
    console.log.apply(this, arguments);
  },
  enableDebug() {
    isDebugEnabled = true;
  },
  disableDebug() {
    isDebugEnabled = false;
  },
  debug() {
    if (isDebugEnabled) {
      console.log.apply(this, arguments);
    }
  },
};

export default Log;
