import {useCallback} from 'react';

const getTime = () => new Date().toLocaleTimeString();

export default class Debug {
  static log(...stuff) {
    if (__DEV__) {
      console.debug(...stuff);
    }
  }

  // for use outside of components
  static makeLogger(name, showTime = false) {
    return showTime
      ? (...stuff) => Debug.log(`[${getTime()}] ${name}:`, ...stuff)
      : (...stuff) => Debug.log(`${name}:`, ...stuff);
  }
}

// for use inside components
export const useLogger = (name, showTime = false) => {
  const log = useCallback(
    (...stuff) => Debug.makeLogger(name, showTime)(...stuff),
    [name, showTime],
  );

  return {log};
};
