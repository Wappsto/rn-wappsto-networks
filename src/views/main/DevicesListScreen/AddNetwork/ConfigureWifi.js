import React, { useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
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
      <Text style={theme.common.label}>
        {CapitalizeFirst(t('onboarding.wifiConfig.ssidLabel'))}
      </Text>
      <TextInput
        style={theme.common.input}
        onChangeText={ssidText =>
          handleTextChange(ssidText, 'ssid')
        }
        value={ssid}
        autoCapitalize='none'
        onSubmitEditing={moveToPasswordField}
        returnKeyType='next'
      />
      <Text style={theme.common.label}>
        {CapitalizeFirst(t('onboarding.wifiConfig.passwordLabel'))}
      </Text>
      <View>
        <TextInput
          ref={passwordInputRef}
          style={theme.common.input}
          onChangeText={passwordText =>
            handleTextChange(passwordText, 'password')
          }
          value={password}
          textContentType='password'
          secureTextEntry={!showPassword}
          autoCapitalize='none'
          onSubmitEditing={saveAndMove}
        />
        <Icon
          style={theme.common.passwordVisibilityButton}
          name={showPassword ? 'eye-slash' : 'eye'}
          onPress={toggleShowPassword}
          size={14}
        />
      </View>
      <TouchableOpacity
        style={theme.common.button}
        onPress={saveAndMove}>
        <Text style={theme.common.btnText}>
          {CapitalizeFirst(t('onboarding.wifiConfig.sendButton'))}
        </Text>
      </TouchableOpacity>
    </>
  );
});

export default ConfigureWifi;
