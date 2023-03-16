import { useState, useEffect, useCallback } from 'react';
import NetInfo from '@react-native-community/netinfo';
import useAppState from './useAppState';

const useConnected = () => {
  const [connected, setConnected] = useState(NetInfo.isInternetReachable);

  useAppState(
    useCallback(() => {
      NetInfo.fetch().then((state) => {
        setConnected(state.isInternetReachable);
      });
    }, []),
  );

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setConnected(state.isInternetReachable);
    });
    return unsubscribe;
  }, []);

  return connected;
};

export default useConnected;
