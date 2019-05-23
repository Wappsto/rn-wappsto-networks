import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import i18n, { capitalizeFirst} from "../translations/i18n";

export default class RequestError extends Component {
  render() {
    let error = this.props.error;
    if(error && error.status === "error"){
      let message;
      if(error.json && error.json.code){
        message = i18n.t('error:' + error.json.code, error.json.data);
        if (message === error.json.code.toString()) {
            message = i18n.t('error:generic');
        }
      } else if(error.responseStatus){
        message = i18n.t("error:status_" + error.responseStatus);
      } else {
        message = i18n.t("error:no_response");
      }
      return (<Text style={styles.error}> {message} </Text>);
    }
    return null;
  }
}

const styles = StyleSheet.create({
  error: {
    backgroundColor: 'red'
  },
});
