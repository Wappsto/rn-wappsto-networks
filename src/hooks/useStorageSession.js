import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-community/async-storage';

const useStorageSession = () => {
  const [status, setStatus] = useState('pending');
  const [session, setSession] = useState();

  // Get Session
  const getSession = async () => {
    try {
      let storageSession = await AsyncStorage.getItem('session');
      if (storageSession !== null) {
        storageSession = JSON.parse(storageSession);
        setSession(storageSession);
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch (e) {
      setStatus('error');
    }
  };

  useEffect(() => {
    getSession();
  }, []);

  return { session, status };
};

export default useStorageSession;
