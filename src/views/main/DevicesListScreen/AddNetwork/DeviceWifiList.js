import React from 'react';
import useDeviceWifiList from '../../../../hooks/useDeviceWifiList';

const DeviceWifiList = React.memo(({ next, previous, setSsid, selectedDevice }) => {
  const { loading, error, step, getDeviceWifiList, result } = useDeviceWifiList(selectedDevice);
  console.log({ loading, error, step, getDeviceWifiList, result });
  return null;
});

export default DeviceWifiList;
