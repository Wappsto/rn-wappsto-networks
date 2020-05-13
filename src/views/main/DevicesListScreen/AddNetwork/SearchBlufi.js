import React, { useCallback, useEffect } from 'react';
import { View, Text as RNtext, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useTranslation, CapitalizeFirst } from '../../../../translations';
import theme from '../../../../theme/themeExport';
import image from '../../../../theme/images';
import Text from '../../../../components/Text';
import Button from '../../../../components/Button';
import useSearchBlufi from '../../../../hooks/setup/blufi/useSearchBlufi';
import BleManager from 'react-native-ble-manager';
import Blufi from '../../../../BlufiLib';

const styles = StyleSheet.create({
  deviceItem:{
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.variables.cardBgColor,
    borderRadius: theme.variables.borderRadiusBase,
    borderWidth: theme.variables.borderWidth,
    borderColor: theme.variables.cardBorderColor,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 25,
  },
  deviceName: {
    fontWeight: 'bold'
  },
  deviceImageWrapper:{
    width: 36,
    height: 36,
    padding: 3,
    marginRight:10,
    alignItems:'center',
    borderWidth: theme.variables.borderWidth,
    borderColor: theme.variables.borderColor,
    borderRadius: theme.variables.borderRadiusBase
  },
  deviceImage:{
    maxWidth: 28,
    maxHeight: 28
  }
});

const SearchBlufi = ({ next, previous, hide, setSelectedDevice }) => {
  const { t } = useTranslation();
  const { devices, scan, scanning, error, permissionError } = useSearchBlufi();
  const handleDevicePress = useCallback((item) => {
    setSelectedDevice(item);
    next();
  }, [next, setSelectedDevice]);

  useEffect(() => {
    if(Blufi.connectedDevice){
      BleManager.disconnect(Blufi.connectedDevice.id);
    }
    Blufi.reset();
  }, []);

  return (
    <>
      {devices.length !== 0 &&
        <>
          <Text
            size='h3'
            content={CapitalizeFirst(t('onboarding.deviceDiscovery.foundDevices'))}
          />
          <Text
            size='p'
            content={CapitalizeFirst(t('onboarding.deviceDiscovery.selectDevice'))}
          />
        </>
      }
      {devices.map(device => (
        <TouchableOpacity key={device.id} onPress={() => handleDevicePress(device)} style={styles.deviceItem}>
          {image.onboarding.deviceIcon &&
            <View style={styles.deviceImageWrapper}>
              <Image resizeMode='contain' source={image.onboarding.deviceIcon} style={styles.deviceImage}/>
            </View>
          }
          <RNtext>
            <Text
              content={device.name}
              style={styles.deviceName}
            />
            {' '}
            <Text
              color='secondary'
              content={device.id}
            />
          </RNtext>
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
                <Text
                  size='p'
                  align='center'
                  content={CapitalizeFirst(t('onboarding.deviceDiscovery.lookingForDevices'))}
                />
              </>
            }
            <ActivityIndicator style={theme.common.spaceAround} color={theme.variables.spinnerColor} size='large'/>
          </>
        :
          <>
            {devices.length === 0 &&
              <>
                {
                  image.onboarding.devicesNotFound &&
                  <Image resizeMode='contain' source={image.onboarding.devicesNotFound} style={theme.common.image}/>
                }
                <Text
                  size='p'
                  align='center'
                  content={CapitalizeFirst(t('onboarding.deviceDiscovery.noDevicesFound'))}
                />
              </>
            }
            <Button
              onPress={scan}
              type='link'
              color='primary'
              text={CapitalizeFirst(t('onboarding.deviceDiscovery.scanAgain'))}
            />
          </>
      }

      {error &&
        <Text
          size='p'
          align='center'
          color='error'
          content={CapitalizeFirst(t('onboarding.deviceDiscovery.scanError'))}
        />
      }
      {permissionError &&
        <Text
          size='p'
          align='center'
          color='error'
          content={CapitalizeFirst(t('onboarding.deviceDiscovery.permissionError.' + permissionError))}
        />
      }
    </>
  )
}

export default SearchBlufi;
