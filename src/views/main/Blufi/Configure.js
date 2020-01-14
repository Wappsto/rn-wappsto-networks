import React, { useEffect, useState, useRef } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { NativeModules, NativeEventEmitter, View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTranslation, CapitalizeFirst } from '../../../translations';
import theme from '../../../theme/themeExport';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {NetworkInfo} from 'react-native-network-info';
import BleManager from 'react-native-ble-manager';
import Blufi from './lib';
import { BlufiParameter } from './lib/util/params';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

// translations:
// ssid / configure
// SAMI: Handle disconnect -> listening.current = false;
const wifiSsidStorageKey = 'wifiSSID';
const wifiPasswordStorageKey = 'wifiPassword';
const Configure = ({ device, hide }) => {
  const { t } = useTranslation();
  const [ ssid, setSsid ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ showPassword, setShowPassword ] = useState(false);
  const [ loading, setLoading ] = useState(false);
  const passwordInputRef = useRef();
  const listening = useRef(false);

  const toggleShowPassword = () => {
    setShowPassword(sp => !sp);
  }

  const moveToPasswordField = () => {
    const trimText = ssid.trim();
    if (trimText !== ssid) {
      setSsid(trimText);
    }
    passwordInputRef.current.focus();
  }

  const handleTextChange = (text, type) => {
    let currentText;
    let set;
    if(type === 'username'){
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
  }

  const configure = async () => {
    try {
      // setLoading(true);
      AsyncStorage.setItem(wifiSsidStorageKey, ssid);
      AsyncStorage.setItem(wifiPasswordStorageKey, password);
      await BleManager.connect(device.id);
      await BleManager.retrieveServices(device.id);
      await BleManager.startNotification(device.id, BlufiParameter.UUID_SERVICE, BlufiParameter.UUID_NOTIFICATION_CHARACTERISTIC);
      if(!listening.current){
        listening.current = true;
        bleManagerEmitter.addListener(
          'BleManagerDidUpdateValueForCharacteristic',
          ({ value, peripheral, characteristic, service }) => {
              // Convert bytes array to string
              Blufi.onCharacteristicChanged(value);
          }
        );
      }
      // SAMI: NegotiateSecurity
      // await Blufi.configure(device, ssid, password);
      Blufi.requestDeviceVersion(device, ssid, password);
    } catch (e) {
      // SAMI: Handle configure error
      console.log(e);
    }
  }

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
    return () => {
      BleManager.disconnect(device.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={theme.common.formElements}>
      <Text style={theme.common.label}>
        {CapitalizeFirst(t('ssid'))}
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
        disabled={loading}
      />
      <Text style={theme.common.label}>
        {CapitalizeFirst(t('password'))}
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
          onSubmitEditing={configure}
          disabled={loading}
        />
        <Icon
          style={theme.common.passwordVisibilityButton}
          name={showPassword ? 'eye-slash' : 'eye'}
          onPress={toggleShowPassword}
          size={14}
        />
      </View>
      {loading && (
        <ActivityIndicator size='large' color={theme.variables.primary} />
      )}
      <TouchableOpacity
        style={[
          theme.common.button,
          loading
            ? theme.common.disabled
            : null,
        ]}
        onPress={configure}>
        <Text style={theme.common.btnText}>
          {CapitalizeFirst(t('configure'))}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default Configure;
