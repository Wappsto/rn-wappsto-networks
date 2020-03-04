import { useState, useEffect } from 'react';
import { AppState } from 'react-native';

const useAppState = (callback) => {
  const [ appState, setAppState ] = useState(AppState.currentState);

  // handle app state change
  useEffect(() => {
    const _handleAppStateChange = (nextAppState) => {
      if (appState.match(/inactive|background/) && nextAppState === 'active' && callback) {
        callback();
      }
      setAppState(nextAppState);
    };

    AppState.addEventListener('change', _handleAppStateChange);
    return () => {
      AppState.removeEventListener('change', _handleAppStateChange);
    }
  }, [appState, callback]);

  return appState;
}

export default useAppState;
