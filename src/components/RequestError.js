import React, {Component} from 'react';
import {Text} from 'react-native';

import theme from '../theme/themeExport';
import i18n, {CapitalizeFirst} from '../translations/i18n';

export default class RequestError extends Component {
  render() {
    let error = this.props.error;
    if (error && error.status === 'error') {
      let message;
      if (error.json && error.json.code) {
        message = i18n.t('error:' + error.json.code, error.json.data);
        if (message === error.json.code.toString()) {
          message = i18n.t('error:generic');
        }
      } else if (error.responseStatus) {
        message = i18n.t('error:status.' + error.responseStatus);
      } else {
        message = i18n.t('error:noResponse');
      }
      return (
        <Text style={[theme.common.error, theme.common.infoText]}>
          {' ' + CapitalizeFirst(message) + ' '}
        </Text>
      );
    }
    return null;
  }
}
