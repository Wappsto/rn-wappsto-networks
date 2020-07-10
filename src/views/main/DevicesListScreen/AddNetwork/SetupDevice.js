import React from 'react';
import { Image, View, ActivityIndicator, StyleSheet } from 'react-native';
import Text from '../../../../components/Text';
import Button from '../../../../components/Button';
import { useTranslation, CapitalizeFirst } from '../../../../translations';
import theme from '../../../../theme/themeExport';
import RequestError from '../../../../components/RequestError';
import useSetupDevice from '../../../../hooks/setup/blufi/useSetupDevice';
import Icon from 'react-native-vector-icons/Feather';
import image from '../../../../theme/images';

const styles = StyleSheet.create({
  progressIcon:{
    marginRight: 10
  },
  progressMessage:{
    flex:1
  },
  responseIcon: {
    marginRight: 10
  },
  response: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30
  }
});

const SetupDevice = React.memo(({ hide, wifiFields, connectToDevice, addNetworkHandler }) => {
  const { t } = useTranslation();
  const { loading, error, step } = useSetupDevice(connectToDevice, addNetworkHandler, wifiFields, true);
  return (
    <>
      {loading ?
        <>
          <Text
            size='h3'
            align='center'
            content={CapitalizeFirst(t('onboarding.wifiSetup.setupInProgress'))}
          />
          {
            image.onboarding.wifiSetup &&
            <Image resizeMode='contain' source={image.onboarding.wifiSetup} style={theme.common.image}/>
          }
          <View style={theme.common.row}>
            <ActivityIndicator size='small'  color={theme.variables.spinnerColor} style={styles.progressIcon} />
            <Text
              style={styles.progressMessage}
              content={CapitalizeFirst(t('onboarding.progress.' + step))}
            />
          </View>
        </>
        :
        <>
          <Text
            size='h3'
            align='center'
            content={CapitalizeFirst(t(error ? 'onboarding.wifiSetup.error.title' : 'onboarding.wifiSetup.success.title'))}
          />
          {
            image.onboarding.wifiSetupError && image.onboarding.wifiSetupSuccess  &&
            <Image resizeMode='contain' source={error ? image.onboarding.wifiSetupError : image.onboarding.wifiSetupSuccess} style={theme.common.image}/>
          }
          <View style={styles.response}>
            <Icon
              name={error ? 'alert-triangle' : 'check-circle' }
              color={error ? theme.variables.alert : theme.variables.success}
              size={30}
              style={styles.responseIcon}
            />
            <View
              style={styles.progressMessage}>
              { error &&
                <Text
                  color='error'
                  content={CapitalizeFirst(t('onboarding.error.' + step))}
                />
              }
              <RequestError request={addNetworkHandler.request} skipCodes={addNetworkHandler.skipErrorCodes} />
              <Text
                color={error ? 'error' : 'success'}
                content={CapitalizeFirst(t('onboarding.wifiSetup.' + (error ? 'error' : 'success') + '.description'))}
              />
            </View>
          </View>
          <Button
            onPress={hide}
            color='primary'
            text={CapitalizeFirst(t('onboarding.wifiSetup.' + (error ? 'error' : 'success') + '.flowButton'))}
          />
        </>
      }
    </>
  );
});

export default SetupDevice;
