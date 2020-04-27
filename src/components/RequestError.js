import React, { useState, useEffect, useRef } from 'react';
import Text from '../components/Text';
import usePrevious from 'wappsto-blanket/hooks/usePrevious';
import theme from '../theme/themeExport';
import {useTranslation, CapitalizeFirst} from '../translations';

const RequestError = React.memo(({ request, skipCodes = [] }) => {
  const { t } = useTranslation();
  const prevRequest = usePrevious(request);
  const [ , setRefresh ] = useState(false);
  const visible = useRef();
  if(prevRequest && request){
    if(prevRequest.id !== request.id){
      visible.current = false;
    } else if(request.status === 'error' && request.json && skipCodes.indexOf(request.json.code) === -1){
      visible.current = true;
    }
  }

  useEffect(() => {
    let t;
    if(visible){
      t = setTimeout(() => {
        visible.current = false;
        setRefresh(r => !r);
      }, 30000);
    }
    return () => {
      clearTimeout(t);
    }
  }, [visible]);

  if (request && visible.current) {
    let message, extra;
    if (request.json && request.json.code) {
      message = t('error:' + request.json.code, request.json.data);
      if (message === request.json.code.toString()) {
        message = t('error:generic');
        extra = request.json.code + ': ' + request.json.message;
      }
    } else if (request.responseStatus) {
      message = t('error:status.' + request.responseStatus);
    } else {
      message = t('error:noResponse');
    }
    return (
      <Text
        size='p'
        color='error'
        content={CapitalizeFirst(message) + (extra ? '\n' + extra : '')}
      />
    );
  }
  return null;
});

export default RequestError;
