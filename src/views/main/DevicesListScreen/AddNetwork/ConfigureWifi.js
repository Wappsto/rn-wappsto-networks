import React, { useEffect, useState, useRef, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { NetworkInfo } from 'react-native-network-info';
import Icon from 'react-native-vector-icons/FontAwesome5';
import theme from '@/theme/themeExport';
import i18n, { CapitalizeFirst } from '@/translations';

const wifiSsidStorageKey = 'wifiSSID';
const wifiPasswordStorageKey = 'wifiPassword';
const ConfigureWifi = React.memo(({ next, previous, hide, ssid, setSsid, password, setPassword }) => {
  const [ showPassword, setShowPassword ] = useState(false);
  const passwordInputRef = useRef();

  const saveAndMove = useCallback(() => {
    AsyncStorage.setItem(wifiSsidStorageKey, ssid);
    AsyncStorage.setItem(wifiPasswordStorageKey, password);
    setShowPassword(false);
    next();
  }, [next, ssid, password]);

  const toggleShowPassword = useCallback(() => {
    setShowPassword(sp => !sp);
  }, []);

  const moveToPasswordField = useCallback(() => {
    const trimText = ssid.trim();
    if (trimText !== ssid) {
      setSsid(trimText);
    }
    passwordInputRef.current.focus();
  }, [ssid, setSsid]);

  const handleTextChange = useCallback((text, type) => {
    let currentText;
    let set;
    if(type === 'ssid'){
      currentText = ssid;
      set = setSsid;
    } else {
      currentText = password;
      set = setPassword;
    }
    if (text.length - currentText.length === 1) {
      set(text);
    } else {
      set(text.trim());
    }
  }, [ssid, password, setSsid, setPassword]);

  const init = async () => {
    try {
      const currentSsid = await NetworkInfo.getSSID();
      const ssid = await AsyncStorage.getItem(wifiSsidStorageKey);
      if(ssid !== null){
        setSsid(ssid);
      } else {
        setSsid(currentSsid);
      }

      const password = await AsyncStorage.getItem(wifiPasswordStorageKey);
      if(password && ssid === currentSsid){
        setPassword(password);
      }
    } catch (e) {

    }
  }

  useEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
