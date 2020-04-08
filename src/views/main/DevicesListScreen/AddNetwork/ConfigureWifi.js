import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Input from '../../../../components/Input';
import Icon from 'react-native-vector-icons/FontAwesome5';
import theme from '../../../../theme/themeExport';
import { useTranslation, CapitalizeFirst } from '../../../../translations';
import useConfigureWifi from '../../../../hooks/useConfigureWifi';

const ConfigureWifi = React.memo(({ next, previous, hide, ssid, setSsid, password, setPassword }) => {
  const { t } = useTranslation();
  const { save, showPassword, toggleShowPassword, handleTextChange, passwordInputRef, moveToPasswordField } = useConfigureWifi(ssid, setSsid, password, setPassword);
  const saveAndMove = useCallback(() => {
    save();
    next();
  }, [save, next]);

  return (
    <>
      <Text style={theme.common.H3}>{CapitalizeFirst(t('onboarding.wifiConfig.title'))}</Text>
      <Text style={theme.common.p}>{CapitalizeFirst(t('onboarding.wifiConfig.intro'))} {CapitalizeFirst(t('onboarding.wifiConfig.warning5Ghz'))}</Text>
      <Input
        label={CapitalizeFirst(t('onboarding.wifiConfig.ssidLabel'))}
        onChangeText={ssidText =>
          handleTextChange(ssidText, 'ssid')
        }
        value={ssid}
        autoCapitalize='none'
        onSubmitEditing={moveToPasswordField}
        returnKeyType='next'
      />
      <Input
        ref={passwordInputRef}
        label={CapitalizeFirst(t('onboarding.wifiConfig.passwordLabel'))}
        onChangeText={passwordText =>
          handleTextChange(passwordText, 'password')
        }
        value={password}
        textContentType='password'
        secureTextEntry={!showPassword}
        autoCapitalize='none'
        onSubmitEditing={saveAndMove}
        showPassword={showPassword}
        toggleShowPassword={toggleShowPassword}
      />
      <TouchableOpacity
        style={theme.common.button}
        onPress={saveAndMove}>
        <Text style={theme.common.buttonText}>
          {CapitalizeFirst(t('onboarding.wifiConfig.sendButton'))}
        </Text>
      </TouchableOpacity>
    </>
  );
});

export default ConfigureWifi;
