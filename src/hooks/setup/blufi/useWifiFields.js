import { useState } from 'react';

const useWifiFields = () => {
  const [ssid, setSsid] = useState('');
  const [password, setPassword] = useState('');

  return {
    ssid,
    setSsid,
    password,
    setPassword,
  };
};

export default useWifiFields;
