import React, { useCallback } from 'react';
import { Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import i18n, { CapitalizeFirst } from '../../../../translations';
import theme from '../../../../theme/themeExport';
import useSearchBlufi from '../../../../hooks/useSearchBlufi';

const filter = ['ad'];
const SearchBlufi = ({ next, previous, hide, setSelectedDevice }) => {
  const { devices, scan, scanning, error, permissionError } = useSearchBlufi(filter);
  const handleDevicePress = useCallback((item) => {
    setSelectedDevice(item);
    next();
  }, [next, setSelectedDevice]);

  return (
    <>
      <Text style={theme.common.H3}>{CapitalizeFirst(i18n.t(devices.length === 0 ? 'blufi.lookingForDevices' : 'blufi.foundDevices'))}</Text>
      {scanning && <ActivityIndicator size='large' style={theme.common.spaceAround}/>}
      {!scanning &&
        <TouchableOpacity onPress={scan} style={theme.common.button}>
          <Text>{CapitalizeFirst(i18n.t('blufi.scanAgain'))}</Text>
        </TouchableOpacity>
      }
      {devices.map(device => (
        <TouchableOpacity key={device.id} onPress={() => handleDevicePress(device)} style={{ marginBottom: 10, backgroundColor: '#EFEFEF', padding: 10}}>
          <Text>{device.name}</Text>
          <Text>{device.id}</Text>
        </TouchableOpacity>
      ))}
      {error && <Text style={theme.common.error}>{CapitalizeFirst(i18n.t('blufi.scanError'))}</Text>}
      {permissionError && <Text style={theme.common.error}>{CapitalizeFirst(i18n.t('blufi.permissionError'))}</Text>}
    </>
  )
}

export default SearchBlufi;
