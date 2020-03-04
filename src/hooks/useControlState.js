import { useState, useEffect } from 'react';
import useRequest from 'wappsto-blanket/hooks/useRequest';

const useControlState = (state, value) => {
  const { request, send } = useRequest();
  const [ input, setInput ] = useState();
  const [ isFocused, setIsFocused ] = useState(false);
  const isUpdating = request && request.status === 'pending';

  useEffect(() => {
    if(!isFocused){
      setInput(value.hasOwnProperty('number') ? parseFloat(state.data) || 0 : state.data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const updateState = (data) => {
    data = data + '';
    if (!isUpdating) {
      let timestamp = new Date().toISOString();
      send({
        method: 'PATCH',
        url: '/state/' + state.meta.id,
        body: {
          data,
          timestamp,
        }
      });
    }
  }

  const updateStateFromInput = ({nativeEvent: {text}}) => {
    updateState(text);
  };

  const updateSwitchState = boolValue => {
    let data;
    if (value.hasOwnProperty('number')) {
      data = boolValue ? '1' : '0';
    } else {
      data = boolValue;
    }
    updateState(data);
    setInput(data);
  };

  return {
    input,
    setInput,
    isFocused,
    setIsFocused,
    updateStateFromInput,
    updateSwitchState,
    updateState,
    request,
    isUpdating
  }
}

export default useControlState;
