import { useState, useEffect, useCallback, useRef } from 'react';
import useRequest from 'wappsto-blanket/hooks/useRequest';

const useControlState = (state, value) => {
  const { request, send } = useRequest();
  const [ input, setInput ] = useState();
  const [ isFocused, setIsFocused ] = useState(false);
  const isUpdating = request && request.status === 'pending';
  const stateId = state && state.meta && state.meta.id;
  const throttleTimer = useRef();

  useEffect(() => {
    if(!isFocused){
      setInput(value.hasOwnProperty('number') ? parseFloat(state.data) || 0 : state.data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const updateState = useCallback((data) => {
    data = data + '';
    if (!isUpdating) {
      let timestamp = new Date().toISOString();
      send({
        method: 'PATCH',
        url: '/state/' + stateId,
        body: {
          data,
          timestamp,
        }
      });
    }
  }, [isUpdating, send, stateId]);

  const updateStateFromInput = useCallback(({nativeEvent: {text}}) => {
    setInput(text);
    updateState(text);
  }, [updateState]);

  const updateSwitchState = useCallback(boolValue => {
    let data;
    if (value.hasOwnProperty('number')) {
      data = boolValue ? '1' : '0';
    } else {
      data = boolValue;
    }
    updateState(data);
    setInput(data);
  }, [updateState, value]);

  const throttledUpdateState = useCallback((data) => {
    setInput(data);
    clearTimeout(throttleTimer.current);
    throttleTimer.current = setTimeout(() => {
      updateState(data);
    }, 1000);
  }, [updateState]);

  return {
    input,
    setInput,
    isFocused,
    setIsFocused,
    updateStateFromInput,
    updateSwitchState,
    throttledUpdateState,
    updateState,
    request,
    isUpdating
  }
}

export default useControlState;
