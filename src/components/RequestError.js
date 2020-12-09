import React, { useState, useEffect } from 'react';
import Text from '../components/Text';
import usePrevious from 'wappsto-blanket/hooks/usePrevious';
import {useTranslation, CapitalizeFirst} from '../translations';

const RequestError = React.memo(({ request, skipCodes = [], warning, autoHide = true }) => {
  const { t } = useTranslation();
  const prevRequest = usePrevious(request);
  const [ visible, setVisible ] = useState(false);

  useEffect(() => {
    if(!visible && request && request.status === 'error' && (!request.json || request.json && skipCodes.indexOf(request.json.code) === -1)){
      setVisible(true);
    } else {
      const prevRequestId = prevRequest && prevRequest.id;
      const requestId = request && request.id;
      if(prevRequestId !== requestId){
        setVisible(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [request]);

  useEffect(() => {
    let t;
    if(visible && autoHide){
      t = setTimeout(() => {
        setVisible(false);
      }, 30000);
    }
    return () => {
      clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  if (request && visible) {
    let message;
    if (request.json && request.json.code) {
      message = t('error:' + request.json.code, request.json.data);
      if (message === request.json.code.toString()) {
        message = request.json.code + ': ' + request.json.message;
      }
    } else if (request.responseStatus) {
      message = t('error:status.' + request.responseStatus);
    } else {
      message = t('error:noResponse');
    }
    return (
      <Text
        size='p'
        color={warning ? 'warning' : 'error'}
        content={CapitalizeFirst(message)}
      />
    );
  }
  return null;
});

export default RequestError;
