import React, { useEffect, useRef, useMemo } from 'react';
import useLogs, { STATUS } from 'wappsto-blanket/hooks/useLogs';
import useEntitySelector from 'wappsto-blanket/hooks/useEntitySelector';

const LogComponent = React.memo(({ id, options, onDone, stateType = 'Report', onlyNumber, nameExtra, cacheId, clearCache, refresh }) => {
  const value = useEntitySelector('value', id);
  const state = useEntitySelector('state', {
    parent: {
      type: 'value',
      id
    },
    filter: {
      type: stateType
    }
  });

  const stateId = state && state.meta.id;
  const stateLogs = useLogs(stateId, null, cacheId);

  const obj = useRef({});

  useMemo(() => {
    let unit = '';
    if(value?.number?.unit){
      unit = ' [' + value.number.unit + ']';
    }
    obj.current = {
      ...obj.current,
      name: (stateType + unit + (nameExtra ? ' | ' + nameExtra  : '')) || undefined,
      id: stateId,
      type: stateType,
      valueId: id,
      isNumber: false,
      isBoolean: value && value.hasOwnProperty('number') && value.number.max - value.number.min === value.number.step
    }
  }, [value, nameExtra, stateId, stateType, id]);

  const mounted = useRef(true);

  useEffect(() => {
    if(value){
      obj.current.isNumber = value.hasOwnProperty('number');
      if(state && (!onlyNumber || obj.current.isNumber)){
        stateLogs.cancel();
        stateLogs.reset(clearCache);
        const cached = stateLogs.getLogs(options);
        if(cached === true){
          onDone({ ...obj.current, data: stateLogs.data, status: stateLogs.status });
        }
      } else {
        onDone({ ...obj.current, data: [] });
      }
    } else {
      onDone({ ...obj.current, data: [], noValue: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options]);

  useEffect(() => {
    if(stateLogs.status !== STATUS.PENDING && stateLogs.status !== STATUS.IDLE && onDone){
      onDone({ ...obj.current, data: stateLogs.data, status: stateLogs.status });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, onDone, stateId, stateType, stateLogs.data, stateLogs.status, value, refresh]);

  useEffect(() => {
    return () => {
      mounted.current = false;
    }
  }, []);

  useEffect(() => {
    const cObj = obj.current;
    return () => {
      if(!mounted.current && onDone){
        onDone({ ...cObj, status: 'unmount'});
      }
    }
  }, [onDone]);

  return null;
})

export { STATUS };
export default LogComponent;
