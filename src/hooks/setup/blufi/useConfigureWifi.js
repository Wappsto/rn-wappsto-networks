import { useEffect, useState, useRef, useCallback } from 'react';
import AsyncStorage from '@react-native-community/async-storage';

let savedSsid = '';
let savedPasswords = {};
let loadedSavedData = false;
const wifiSsidStorageKey = 'wifiSSID';
const wifiPasswordStorageKey = 'wifiPassword';
const useConfigureWifi = (wifiFields) => {
  const { ssid, setSsid, password, setPassword } = wifiFields;
  const [ showPassword, setShowPassword ] = useState(false);
  const passwordInputRef = useRef();
  const toSave = useRef({});

  const save = () => {
    savedSsid = toSave.current.ssid;
    savedPasswords[toSave.current.ssid] = toSave.current.password;
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
      const sp = savedPasswords.current[text];
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
    try {
      if(!loadedSavedData){
        savedSsid = await AsyncStorage.getItem(wifiSsidStorageKey);
      }
      if(savedSsid !== ssid){
        setPassword('');
      }
      if(!ssid){
        setSsid(savedSsid);
      }

      if(!loadedSavedData){
        savedPasswords = await AsyncStorage.getItem(wifiPasswordStorageKey);
        savedPasswords = JSON.parse(savedPasswords);
      }
      if(savedPasswords[ssid]){
        setPassword(savedPasswords[ssid]);
      }
    } catch (e) {
      savedPasswords = {};
    }
    loadedSavedData = true;
  }

  useEffect(() => {
    init();
    return save;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    for(let key in wifiFields){
      const val = wifiFields[key];
      if(val.constructor !== Function){
        toSave.current[key] = val;
      }
    }
  }, [wifiFields]);

  return { showPassword, toggleShowPassword, handleTextChange, passwordInputRef, moveToPasswordField };
}

export default useConfigureWifi;
