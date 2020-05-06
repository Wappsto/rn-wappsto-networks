import React from 'react';
import { Image, View, ActivityIndicator } from 'react-native';
import Text from '../../../../components/Text';
import Button from '../../../../components/Button';
import { useTranslation, CapitalizeFirst } from '../../../../translations';
import theme from '../../../../theme/themeExport';
import RequestError from '../../../../components/RequestError';
import useSetupDevice from '../../../../hooks/useSetupDevice';
import Icon from 'react-native-vector-icons/Feather';
import image from '../../../../theme/images';

const SetupDevice = React.memo(({ next, previous, hide, ssid, password, selectedDevice, sendRequest, postRequest, skipCodes, acceptedManufacturerAsOwner }) => {
  const { t } = useTranslation();
  const { loading, error, step } = useSetupDevice(selectedDevice, sendRequest, postRequest, acceptedManufacturerAsOwner, ssid, password);
  return (
    <>
      {loading ?
        <>
          <Text
            size='h3'
            content={CapitalizeFirst(t('onboarding.wifiSetup.setupInProgress'))}
          />
          {
            image.onboarding.wifiSetup &&
            <Image resizeMode='contain' source={image.onboarding.wifiSetup} style={theme.common.image}/>
          }
          <View style={theme.common.row}>
            <ActivityIndicator size='small'  color={theme.variables.spinnerColor} style={{marginRight: 10}} />
            <Text
              style={{flex:1}}
              content={CapitalizeFirst(t('onboarding.wifiSetup.progress.' + step))}
            />
          </View>
        </>
        :
        <>
          <Text
            size='h3'
            content={CapitalizeFirst(t(error ? 'onboarding.wifiSetup.error.title' : 'onboarding.wifiSetup.success.title'))}
          />
          {
            image.onboarding.wifiSetupError && image.onboarding.wifiSetupSuccess  &&
            <Image resizeMode='contain' source={error ? image.onboarding.wifiSetupError : image.onboarding.wifiSetupSuccess} style={theme.common.image}/>
          }
          <View style={theme.common.row}>
            <Icon
              name={error ? 'alert-triangle' : 'check-circle' }
              color={error ? theme.variables.alert : theme.variables.success}
              size={30}
              style={{marginRight: 10}}
            />
            <View>
              <Text
                color={error ? 'error' : 'success'}
                content={ error && CapitalizeFirst(t('onboarding.wifiSetup.error.' + step))}
              />
              <RequestError request={postRequest} skipCodes={skipCodes} />
              <Text
                color={error ? 'error' : 'success'}
                content={error && CapitalizeFirst(t('onboarding.wifiSetup.' + (error ? 'error' : 'success') + '.description'))}
              />
            </View>
          </View>
          <Button
            style={{marginTop: 30}}
            onPress={hide}
            color='primary'
            text={CapitalizeFirst(t('onboarding.wifiSetup.' + (error ? 'error' : 'success') +'.flowButton'))}
          />
        </>
      }
    </>
  );
});

export default SetupDevice;
