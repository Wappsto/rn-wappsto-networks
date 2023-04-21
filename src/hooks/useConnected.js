import { useCallback, useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';
import useAppState from './useAppState';

export default function useConnected() {
  const [connected, setConnected] = useState(NetInfo.isInternetReachable);

  const setInternetReachable = state => setConnected(state.isInternetReachable);

  useAppState(
    useCallback(() => {
      NetInfo.fetch().then(setInternetReachable);
    }, []),
  );

  useEffect(() => NetInfo.addEventListener(setInternetReachable), []);

  return connected;
}
