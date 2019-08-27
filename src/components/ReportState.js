import React, { PureComponent } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image
} from 'react-native';

import Timestamp from './Timestamp';
import RequestError from './RequestError';

import theme from '../theme/themeExport';

class ReportState extends PureComponent {
  content = () => {
    const { state, value } = this.props;
    if (value.hasOwnProperty('blob') && value.type === 'image') {
      if(state.data && state.data.length > 0){
        return (
          <Image
            style={styles.image}
            source={{ uri: state.data }}
          />
        );
      } else {
        return null;
      }
    } else {
      return (
        <Text>{state.data} {value.number && value.number.unit}</Text>
      );
    }
  }
  render() {
    return (
      <View style={{alignSelf: 'center'}}>
        {this.content()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  image: {
    width: 200,
    height: 200
  }
});

export default ReportState;
