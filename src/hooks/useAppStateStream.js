import { useState, useEffect, useMemo } from 'react';
import { AppState } from 'react-native';
import { startStream, endStream } from 'src/util/helpers';
import { useDispatch, useSelector } from 'react-redux';
import { config } from 'src/configureWappstoRedux';
import { makeStreamSelector } from 'wappsto-redux/selectors/stream';

const useAppStateStream = () => {
  const dispatch = useDispatch();
  const [ appState, setAppState ] = useState(AppState.currentState);
  const getStream = useMemo(makeStreamSelector, []);
  const stream = useSelector(state => getStream(state, config.stream && config.stream.name));

  // handle app state change
  useEffect(() => {
    const _handleAppStateChange = (nextAppState) => {
      if (appState.match(/inactive|background/) && nextAppState === 'active' && stream && stream.ws && stream.ws.readyState === stream.ws.CLOSED) {
        endStream(dispatch, true);
        startStream(dispatch);
      }
      setAppState(nextAppState);
    };

    AppState.addEventListener('change', _handleAppStateChange);
    return () => {
      AppState.removeEventListener('change', _handleAppStateChange);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appState, stream]);

  // subscribe to stream
  useEffect(() => {
    startStream(dispatch);
    return () => {
      endStream(dispatch, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

export default useAppStateStream;
