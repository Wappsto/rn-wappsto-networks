import React, { useState, useEffect } from 'react';
import {Text} from 'react-native';
import usePrevious from 'wappsto-blanket/hooks/usePrevious';
import theme from '../theme/themeExport';
import i18n, {CapitalizeFirst} from '../translations';

const RequestError = React.memo(({ request, skipCodes = [] }) => {
  const prevRequest = usePrevious(request);
  const [ visible, setVisible ] = useState(false);

  useEffect(() => {
    let t;
    if(visible){
      t = setTimeout(() => {
        setVisible(false);
      }, 30000);
    }
    return () => {
      clearTimeout(t);
    }
  }, [visible]);

  useEffect(() => {
    if(prevRequest && request){
      if(prevRequest.id !== request.id){
        setVisible(false);
      } else if(request.status === 'error' && request.json && skipCodes.indexOf(request.json.code) === -1){
        setVisible(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [request]);

  if (visible) {
    let message, extra;
    if (request.json && request.json.code) {
      message = i18n.t('error:' + request.json.code, request.json.data);
      if (message === request.json.code.toString()) {
        message = i18n.t('error:generic');
        extra = request.json.code + ': ' + request.json.message;
      }
    } else if (request.responseStatus) {
      message = i18n.t('error:status.' + request.responseStatus);
    } else {
      message = i18n.t('error:noResponse');
    }
    return (
      <Text style={[theme.common.error, theme.common.infoText]}>
        {CapitalizeFirst(message)}
        {extra && '\n' + extra}
      </Text>
    );
  }
  return null;
});

export default RequestError;
