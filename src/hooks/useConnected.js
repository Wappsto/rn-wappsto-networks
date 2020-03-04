import { useState, useEffect, useCallback } from 'react';
import NetInfo from '@react-native-community/netinfo';
import useAppState from './useAppState';

const useConnected = () => {
  const [ connected, setConnected ] = useState(NetInfo.isConnected);

  useAppState(
    useCallback(() => {
      setConnected(NetInfo.isConnected);
    }, [])
  )

  useEffect(() => {
    NetInfo.isConnected.addEventListener('connectionChange', setConnected);
    return () => {
      NetInfo.isConnected.removeEventListener('connectionChange', setConnected);
    }
  }, []);

  return connected;
}

export default useConnected;
