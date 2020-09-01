import { useEffect, useState, useRef, useCallback } from 'react';
import AsyncStorage from '@react-native-community/async-storage';

let savedSsid = '';
let savedPasswords = {};
const wifiSsidStorageKey = 'wifiSSID';
const wifiPasswordStorageKey = 'wifiPassword';

(async function init(){
  try {
    savedSsid = await AsyncStorage.getItem(wifiSsidStorageKey) || '';
    savedPasswords = await AsyncStorage.getItem(wifiPasswordStorageKey);
    savedPasswords = JSON.parse(savedPasswords) || {};
  } catch (e) {
    savedPasswords = {};
  }
})()

const useConfigureWifi = (wifiFields) => {
  const { ssid, setSsid, password, setPassword } = wifiFields;
  const [ showPassword, setShowPassword ] = useState(false);
  const passwordInputRef = useRef();

  const save = () => {
    AsyncStorage.setItem(wifiSsidStorageKey, savedSsid);
    AsyncStorage.setItem(wifiPasswordStorageKey, JSON.stringify(savedPasswords));
    setShowPassword(false);
  };

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
      const sp = savedPasswords[text];
      if(sp){
        setPassword(sp);
      }
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
    if(!ssid){
      setSsid(savedSsid);
    }
    setPassword(savedPasswords[ssid || savedSsid] || '');
  }

  useEffect(() => {
    init();
    return save;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    savedSsid = ssid;
    savedPasswords[savedSsid] = password;
  }, [ssid, password]);

  return { showPassword, toggleShowPassword, handleTextChange, passwordInputRef, moveToPasswordField };
}

export default useConfigureWifi;
