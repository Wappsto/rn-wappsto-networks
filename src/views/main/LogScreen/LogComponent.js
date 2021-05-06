import React, { useEffect, useRef, useMemo } from 'react';
import useLogs, { STATUS } from 'wappsto-blanket/hooks/useLogs';
import useEntitySelector from 'wappsto-blanket/hooks/useEntitySelector';
import { useTranslation, CapitalizeFirst } from '../../../translations';

const LogComponent = React.memo(({ id, options, onDone, stateType = 'Report', onlyNumber, nameExtra, cacheId, clearCache, refresh, live }) => {
  const { t } = useTranslation();
  const liveData = useRef([]);
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
      name: (CapitalizeFirst(t('dataModel:stateProperties.' + stateType.toLowerCase() + 'State')) + unit + (nameExtra ? ' | ' + nameExtra  : '')) || undefined,
      id: stateId,
      type: stateType,
      valueId: id,
      isNumber: false,
      isBoolean: value && value.hasOwnProperty('number') && value.number.max - value.number.min === value.number.step
    }
  }, [value, nameExtra, stateId, stateType, id, t]);

  const mounted = useRef(true);

    useEffect(() => {
    if(value){
      obj.current.isNumber = value.hasOwnProperty('number');
      if(state && (!onlyNumber || obj.current.isNumber)){
        if(!live){
          stateLogs.cancel();
          stateLogs.reset(clearCache);
          const cached = stateLogs.getLogs(options);
          if(cached === true){
            onDone({ ...obj.current, data: stateLogs.data, status: stateLogs.status });
          }
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

  useEffect(() => {
    if(live){
      if(value && state && (!onlyNumber || obj.current.isNumber)){
        if(liveData.current.length > 9){
          liveData.current.shift();
        }
        liveData.current.push({ data: state.data, time: state.timestamp });
        onDone({ ...obj.current, data: [...liveData.current], status: STATUS.SUCCESS });
      }
    } else {
      liveData.current = [];
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, live]);

  return null;
})

export { STATUS };
export default LogComponent;
