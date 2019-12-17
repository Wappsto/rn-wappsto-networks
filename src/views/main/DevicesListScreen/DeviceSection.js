import React, { useMemo } from 'react';
import ListRow from './ListRow';
import { useSelector } from 'react-redux';
import { makeEntitySelector } from 'wappsto-redux/selectors/entities';
import { selectedDeviceName } from '../../../util/params';

const DeviceSection = React.memo(({ navigation, id }) => {
  const getEntity = useMemo(makeEntitySelector, []);
  const device = useSelector(state => getEntity(state, 'device', id));
  if(!device || !device.meta || !device.meta.id){
    return null;
  }
  return (
    <ListRow
      key={device.meta.id}
      selectedName={selectedDeviceName}
      navigateTo='DeviceScreen'
      item={device}
      childName='value'
      navigation={navigation}
    />
  );
});

export default DeviceSection;
