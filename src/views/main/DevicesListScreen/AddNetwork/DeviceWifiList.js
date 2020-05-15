import React from 'react';
import { View, ActivityIndicator, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Text from '../../../../components/Text';
import Button from '../../../../components/Button';
import useDeviceScanWifi from '../../../../hooks/setup/blufi/useDeviceScanWifi';
import { useTranslation, CapitalizeFirst } from '../../../../translations';
import theme from '../../../../theme/themeExport';
import image from '../../../../theme/images';

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

const DeviceWifiList = React.memo(({ next, selectedDevice, wifiFields }) => {
  const { t } = useTranslation();
  const { loading, error, step, scan, result } = useDeviceScanWifi(selectedDevice);

  const selectSsid = (ssid) => {
    wifiFields.setSsid(ssid);
    next();
  };

  return (
    <>
      {loading &&
        <>
          <Text
            size='h3'
            content={CapitalizeFirst(t('onboarding.wifiScan.scanInProgress'))}
          />
          <View style={theme.common.row}>
            <ActivityIndicator size='small' color={theme.variables.spinnerColor} style={{marginRight: 10}} />
            <Text
              style={{flex:1}}
              content={CapitalizeFirst(t('onboarding.wifiScan.progress.' + step))}
            />
          </View>
        </>
      }
      {!loading && error &&
        <>
          <Text
            size='h3'
            content={CapitalizeFirst(t('onboarding.wifiScan.error.title'))}
          />
          {
            image.onboarding.wifiSetupError && image.onboarding.wifiSetupSuccess  &&
            <Image resizeMode='contain' source={image.onboarding.wifiSetupError} style={theme.common.image}/>
          }
          <Text
            color='error'
            content={CapitalizeFirst(t('onboarding.wifiScan.error.' + step))}
          />
        </>
      }
      {!loading && !error && result.length === 0 &&
        <Text
          size='p'
          align='center'
          content={CapitalizeFirst(t('onboarding.wifiScan.noWifiFound'))}
        />
      }
      {!loading && !error && result.length !== 0 &&
        <>
          <Text
            size='h3'
            content={CapitalizeFirst(t('onboarding.wifiScan.foundWifi'))}
          />
          <Text
            size='p'
            content={CapitalizeFirst(t('onboarding.wifiScan.selectWifi'))}
          />
          {result.map((wifi, index) => (
            <TouchableOpacity key={index} onPress={() => selectSsid(wifi.ssid)} style={styles.deviceItem}>
              {image.onboarding.deviceIcon &&
                <View style={styles.deviceImageWrapper}>
                  <Image resizeMode='contain' source={image.onboarding.deviceIcon} style={styles.deviceImage}/>
                </View>
              }
              <Text
                content={wifi.ssid}
                style={styles.deviceName}
              />
            </TouchableOpacity>
          ))}
        </>
      }
      {!loading &&
        <Button
          onPress={scan}
          type='link'
          color='primary'
          text={CapitalizeFirst(t('onboarding.wifiScan.scanAgain'))}
        />
      }
      <Text
        style={{ marginTop: 30 }}
        size='p'
        align='center'
        content={t('onboarding.wifiScan.or')}
      />
      <Button
        onPress={next}
        type='link'
        color='primary'
        text={CapitalizeFirst(t('onboarding.wifiScan.putOwnWifi'))}
      />
    </>
  );
});

export default DeviceWifiList;
