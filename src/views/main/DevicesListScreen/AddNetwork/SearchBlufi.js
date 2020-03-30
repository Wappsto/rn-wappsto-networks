import React, { useCallback } from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useTranslation, CapitalizeFirst } from '../../../../translations';
import theme from '../../../../theme/themeExport';
import image from '../../../../theme/images';
import useSearchBlufi from '../../../../hooks/useSearchBlufi';

const styles = StyleSheet.create({
  deviceName: {
    fontWeight: 'bold'
  }
});

const SearchBlufi = ({ next, previous, hide, setSelectedDevice }) => {
  const { t } = useTranslation();
  const { devices, scan, scanning, error, permissionError } = useSearchBlufi();
  const handleDevicePress = useCallback((item) => {
    setSelectedDevice(item);
    next();
  }, [next, setSelectedDevice]);

  return (
    <>
      {
        devices.length !== 0 &&
          <>
            <Text style={theme.common.H3}>{CapitalizeFirst(t('onboarding.deviceDiscovery.foundDevices'))}</Text>
            <Text style={theme.common.p}>{CapitalizeFirst(t('onboarding.deviceDiscovery.selectDevice'))}</Text>
          </>
      }
      {devices.map(device => (
        <TouchableOpacity key={device.id} onPress={() => handleDevicePress(device)} style={theme.common.card}>
          <Text>
            <Text style={styles.deviceName}>{device.name}</Text>
            {' '}
            <Text style={theme.common.secondary}>{device.id}</Text>
          </Text>
        </TouchableOpacity>
      ))}

      {
        scanning ?
          <>
            {devices.length === 0 &&
              <>
                {image.onboarding.deviceDiscovery &&
                  <Image resizeMode='contain' source={image.onboarding.deviceDiscovery} style={theme.common.image}/>
                }
                <Text style={[theme.common.p, {textAlign:'center'}]}>{CapitalizeFirst(t('onboarding.deviceDiscovery.lookingForDevices'))}</Text>
              </>
            }
            <ActivityIndicator style={theme.common.spaceAround} size='large'/>
          </>
        :
          <>
            {devices.length === 0 &&
              <>
                {
                  image.onboarding.devicesNotFound &&
                  <Image resizeMode='contain' source={image.onboarding.devicesNotFound} style={theme.common.image}/>
                }
                <Text style={[theme.common.p, {textAlign:'center'}]}>{CapitalizeFirst(t('onboarding.deviceDiscovery.noDevicesFound'))}</Text>
              </>
            }
            <TouchableOpacity onPress={scan}>
              <Text style={[theme.common.linkBtn, theme.common.primaryColor, {textAlign:'center'}]}>{CapitalizeFirst(t('onboarding.deviceDiscovery.scanAgain'))}</Text>
            </TouchableOpacity>
          </>
      }

      {error &&
        <Text style={theme.common.p, theme.common.error}>{CapitalizeFirst(t('onboarding.deviceDiscovery.scanError'))}</Text>
      }
      {permissionError &&
        <Text style={theme.common.p, theme.common.error}>{CapitalizeFirst(t('onboarding.deviceDiscovery.permissionError'))}</Text>
      }
    </>
  )
}

export default SearchBlufi;
