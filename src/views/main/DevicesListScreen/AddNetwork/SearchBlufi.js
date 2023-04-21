import React, { useCallback, useEffect } from 'react';
import {
  ActivityIndicator,
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Button from '../../../../components/Button';
import Text from '../../../../components/Text';
import useSearchBlufi from '../../../../hooks/setup/blufi/useSearchBlufi';
import image from '../../../../theme/images';
import theme from '../../../../theme/themeExport';
import { CapitalizeFirst, useTranslation } from '../../../../translations';

const styles = StyleSheet.create({
  deviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.variables.cardBgColor,
    borderRadius: theme.variables.borderRadiusBase,
    borderWidth: theme.variables.borderWidth,
    borderColor: theme.variables.cardBorderColor,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 10,
  },
  deviceImageWrapper: {
    maxHeight: 36,
    marginRight: 8,
    alignItems: 'center',
  },
  deviceImage: {
    maxWidth: 28,
    maxHeight: 28,
  },
  deviceSignalQualityIconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  deviceSignalQualityIcon: {
    width: 15,
    height: 15,
  },
  id: {
    fontSize: 11,
  },
});

const SearchBlufi = ({ next, selectedDevice, setSelectedDevice, connectToDevice }) => {
  const { t } = useTranslation();
  const {
    devices,
    canScan,
    scan,
    scanning,
    error,
    permissionError,
    PERMISSION_ERRORS,
    openSettings,
  } = useSearchBlufi();
  const handleDevicePress = useCallback(
    item => {
      setSelectedDevice(item);
      next();
    },
    [next, setSelectedDevice],
  );

  useEffect(() => {
    connectToDevice.disconnect();
    if (selectedDevice) {
      setSelectedDevice();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signalQuality = rssi => {
    if (rssi >= -50) {
      return image.onboarding.rssiSignalIcon.excellent;
    } else if (rssi < -50 && rssi >= -60) {
      return image.onboarding.rssiSignalIcon.good;
    } else if (rssi < -60 && rssi >= -70) {
      return image.onboarding.rssiSignalIcon.fair;
    }
    return image.onboarding.rssiSignalIcon.poor;
  };

  return (
    <>
      {devices.length !== 0 && (
        <>
          <Text
            size="h3"
            align="center"
            content={CapitalizeFirst(t('onboarding.deviceDiscovery.foundDevices'))}
          />
          <Text size="p" content={CapitalizeFirst(t('onboarding.deviceDiscovery.selectDevice'))} />
        </>
      )}
      {devices.map(device => (
        <TouchableOpacity
          key={device.id}
          onPress={() => handleDevicePress(device)}
          style={styles.deviceItem}>
          <View style={theme.common.row}>
            {image.onboarding.deviceIcon &&
              device.name &&
              image.onboarding.deviceIcon[device.name.split('-')[0].toLowerCase()] && (
                <View style={styles.deviceImageWrapper}>
                  <Image
                    resizeMode="contain"
                    source={image.onboarding.deviceIcon[device.name.split('-')[0].toLowerCase()]}
                    style={styles.deviceImage}
                  />
                </View>
              )}
            <View>
              <Text
                bold
                content={
                  (device.name
                    ? device.name
                    : CapitalizeFirst(t('onboarding.deviceDiscovery.unknownName'))) + ' '
                }
              />
              {Platform.OS === 'ios' ? null : (
                <Text style={styles.id} color="secondary" content={device.id} />
              )}
            </View>
          </View>
          {image.onboarding.rssiSignalIcon && (
            <View style={styles.deviceSignalQualityIconWrapper}>
              <Image
                resizeMode="contain"
                source={signalQuality(device.rssi)}
                style={styles.deviceSignalQualityIcon}
              />
            </View>
          )}
        </TouchableOpacity>
      ))}

      {scanning ? (
        <>
          {devices.length === 0 && (
            <>
              {image.onboarding.deviceDiscovery && (
                <Image
                  resizeMode="contain"
                  source={image.onboarding.deviceDiscovery}
                  style={theme.common.image}
                />
              )}
              <Text
                size="p"
                align="center"
                content={CapitalizeFirst(t('onboarding.deviceDiscovery.lookingForDevices'))}
              />
            </>
          )}
          <ActivityIndicator
            style={theme.common.spaceAround}
            color={theme.variables.spinnerColor}
            size="large"
          />
        </>
      ) : (
        <>
          {!error && devices.length === 0 && (
            <>
              {image.onboarding.devicesNotFound && (
                <Image
                  resizeMode="contain"
                  source={image.onboarding.devicesNotFound}
                  style={theme.common.image}
                />
              )}
              <Text
                size="p"
                align="center"
                content={CapitalizeFirst(t('onboarding.deviceDiscovery.noDevicesFound'))}
              />
            </>
          )}
          {canScan && (
            <Button
              onPress={scan}
              type="link"
              color="primary"
              text={CapitalizeFirst(t('onboarding.deviceDiscovery.scanAgain'))}
            />
          )}
          {error && devices.length === 0 && (
            <Text
              size="p"
              align="center"
              color="error"
              content={CapitalizeFirst(t('onboarding.deviceDiscovery.scanError'))}
            />
          )}
        </>
      )}
      {permissionError && (
        <>
          <Text
            size="p"
            align="center"
            color="error"
            content={CapitalizeFirst(
              t('onboarding.deviceDiscovery.permissionError.' + permissionError),
            )}
          />
          {permissionError === PERMISSION_ERRORS.BLUETOOTH_UNAUTHORIZED && (
            <Button
              onPress={openSettings}
              type="link"
              color="primary"
              text={CapitalizeFirst(t('onboarding.deviceDiscovery.goToSettings'))}
            />
          )}
        </>
      )}
    </>
  );
};

export default SearchBlufi;
