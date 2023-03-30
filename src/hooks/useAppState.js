import { useState, useEffect } from 'react';
import { AppState } from 'react-native';

export default function useAppState(callback) {
  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    const _handleAppState = nextState => {
      if (appState.match(/inactive|background/) && nextState === 'active' && callback) {
        callback();
      }
      setAppState(nextState);
    };

    const listener = AppState.addEventListener('change', _handleAppState);

    return () => {
      listener.remove();
    };
  }, [appState, callback]);

  return appState;
}
