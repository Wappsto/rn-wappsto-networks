import { useEffect, useMemo, useCallback } from 'react';
import { startStream, endStream } from '../util/helpers';
import { useDispatch, useSelector } from 'react-redux';
import { config } from '../configureWappstoRedux';
import { makeStreamSelector } from 'wappsto-redux/selectors/stream';
import useAppState from './useAppState';

const useAppStateStream = () => {
  const dispatch = useDispatch();
  const getStream = useMemo(makeStreamSelector, []);
  const stream = useSelector(state => getStream(state, config.stream && config.stream.name));

  useAppState(
    useCallback(() => {
      if (stream && stream.ws && stream.ws.readyState === stream.ws.CLOSED) {
        endStream(dispatch, true);
        startStream(dispatch);
      }
    }, [dispatch, stream])
  );

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
