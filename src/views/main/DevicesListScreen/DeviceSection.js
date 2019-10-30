import React, {Component} from 'react';
import ListRow from './ListRow';
import {connect} from 'react-redux';
import {getEntity} from '../../../wappsto-redux/selectors/entities';

function mapStateToProps(state, componentProps) {
  return {
    device: getEntity(state, 'device', componentProps.id),
  };
}

class DeviceSection extends Component {
  render() {
    const {device, navigation} = this.props;
    return (
      <ListRow
        key={device.meta.id}
        selectedName="selectedDevice"
        navigateTo="DeviceScreen"
        item={device}
        childName="value"
        navigation={navigation}
      />
    );
  }
}

export default connect(mapStateToProps)(DeviceSection);
