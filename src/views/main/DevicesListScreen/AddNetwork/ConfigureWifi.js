import React, { useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import theme from '@/theme/themeExport';
import i18n, { CapitalizeFirst } from '@/translations';
import useConfigureWifi from '@/hooks/useConfigureWifi';

const ConfigureWifi = React.memo(({ next, previous, hide, ssid, setSsid, password, setPassword }) => {
  const { save, showPassword, toggleShowPassword, handleTextChange, passwordInputRef, moveToPasswordField } = useConfigureWifi(ssid, setSsid, password, setPassword);
  const saveAndMove = useCallback(() => {
    save();
    next();
  }, [save, next]);

  return (
    <View style={theme.common.formElements}>
      <Text style={theme.common.H3}>{CapitalizeFirst(i18n.t('blufi.insertWifi'))}</Text>
      <Text style={[theme.common.infoText, theme.common.warning]}>{CapitalizeFirst(i18n.t('blufi.warning5G'))}</Text>
      <Text style={theme.common.label}>
        {CapitalizeFirst(i18n.t('blufi.ssid'))}
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
        {CapitalizeFirst(i18n.t('blufi.password'))}
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
          {CapitalizeFirst(i18n.t('blufi.configure'))}
        </Text>
      </TouchableOpacity>
    </View>
  );
});

export default ConfigureWifi;
