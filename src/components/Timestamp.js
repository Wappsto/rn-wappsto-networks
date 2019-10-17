import React from 'react';
import {Text} from 'react-native';

import TimestampComponent from '../wappsto-components/Timestamp';

export default class Timestamp extends TimestampComponent {
  render() {
    return <Text>{this.fromNow(this.props.time)}</Text>;
  }
}
