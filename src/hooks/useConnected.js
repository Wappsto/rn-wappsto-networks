import { useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';

const useConnected = () => {
  const [ connected, setConnected ] = useState(true);

  useEffect(() => {
    NetInfo.isConnected.addEventListener('connectionChange', setConnected);
    return () => {
      NetInfo.isConnected.removeEventListener('connectionChange', setConnected);
    }
  }, []);

  return connected;
}

export default useConnected;
