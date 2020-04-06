import React from 'react';
import { Image, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
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
          <Text style={theme.common.H3}>{CapitalizeFirst(t('onboarding.wifiSetup.setupInProgress'))}</Text>
          {
            image.onboarding.wifiSetup &&
            <Image resizeMode='contain' source={image.onboarding.wifiSetup} style={theme.common.image}/>
          }
          <View style={theme.common.row}>
            <ActivityIndicator size='small' color={theme.variables.primary} style={{marginRight: 10}} />
            <Text style={{flex:1}}>{CapitalizeFirst(t('onboarding.wifiSetup.progress.' + step))}</Text>
          </View>
        </>
        :
        <>
          <Text style={theme.common.H3}>
            {CapitalizeFirst(t(error ? 'onboarding.wifiSetup.error.title' : 'onboarding.wifiSetup.success.title'))}
          </Text>
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
            <Text style={{flex:1}}>
              {error &&
                <>
                  {CapitalizeFirst(t('onboarding.wifiSetup.error.' + step))}
                  {' '}
                  <RequestError request={postRequest} skipCodes={skipCodes} />
                  {' '}
                </>
              }
              {CapitalizeFirst(t('onboarding.wifiSetup.' + (error ? 'error' : 'success') + '.description'))}
            </Text>
          </View>
          <TouchableOpacity
            style={[theme.common.button,{marginTop: 30}]}
            onPress={hide}>
            <Text style={theme.common.buttonText}>{CapitalizeFirst(t('onboarding.wifiSetup.' + (error ? 'error' : 'success') +'.flowButton'))}</Text>
          </TouchableOpacity>
        </>
      }
    </>
  );
});

export default SetupDevice;
