import React from 'react';
import {Text} from 'react-native';

import theme from '../theme/themeExport';
import i18n, {CapitalizeFirst} from '../translations';

const RequestError = React.memo(({ request, skipCodes = [] }) => {
  if (request && request.status === 'error' && request.json && skipCodes.indexOf(request.json.code) === -1) {
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
