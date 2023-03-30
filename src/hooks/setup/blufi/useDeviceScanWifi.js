import { useState, useEffect, useRef } from 'react';
import Blufi from '../../../BlufiLib';
import { BlufiCallback } from '../../../BlufiLib/util/params';
import { usePrevious } from 'wappsto-blanket';

const STEPS = {
  GETDEVICEWIFILIST: 'getDeviceWifiList',
  DONE: 'done',
};

export const ERRORS = {
  FAILEDGETDEVICEWIFILIST: 'failedGetDeviceWifiList',
  FAILEDGETDEVICEWIFILISTTIMEOUT: 'failedGetDeviceWifiListTimeout',
  DEVICEBUSY: 'DEVICEBUSY', //when device does not want to answer because it received wrong ssid/password
  GENERIC: 'generic',
};

const timeoutLimit = 20000;
const useDeviceScanWifi = connectToDevice => {
  const {
    loading: connectionLoading,
    error: connectionError,
    step: connectionStep,
    connect,
    disconnect,
    isConnected,
  } = connectToDevice;
  const prevConnected = usePrevious(isConnected());
  const [result, setResult] = useState([]);
  const [step, setStep] = useState(STEPS.GETDEVICEWIFILIST);
  const timeout = useRef(null);
  const success = useRef(false);
  const error = useRef(false);

  error.current = Object.values(ERRORS).includes(step) || connectionError;
  const currentStep = connectionLoading || connectionError ? connectionStep : step;
  const done = step === STEPS.DONE;
  const loading = !done && !error.current;

  const removeBlufiListeners = () => {
    Blufi.onError = () => {};
    Blufi.onDeviceScanResult = () => {};
  };

  const addBlufiListeners = () => {
    Blufi.onError = () => {
      clearTimeout(timeout.current);
      if (!error.current) {
        error.current = true;
        setStep(ERRORS.GENERIC);
      }
    };

    Blufi.onDeviceScanResult = async (status, data, tError) => {
      if (error.current) {
        return;
      }
      if (status === BlufiCallback.STATUS_SUCCESS) {
        success.current = true;
        setStep(STEPS.DONE);
        setResult(data.sort((a, b) => b.rssi - a.rssi));
      } else if (tError && tError.includes('133')) {
        setStep(ERRORS.DEVICEBUSY);
        disconnect();
      } else {
        setStep(ERRORS.FAILEDGETDEVICEWIFILIST);
      }
      clearTimeout(timeout.current);
    };
  };

  const getDeviceWifiList = () => {
    addBlufiListeners();
    setStep(STEPS.GETDEVICEWIFILIST);
    timeout.current = setTimeout(() => {
      // device did not send back network id
      setStep(ERRORS.FAILEDGETDEVICEWIFILISTTIMEOUT);
    }, timeoutLimit);
    Blufi.requestDeviceWifiScan();
  };

  const scan = async force => {
    if (force || !loading) {
      if (!isConnected()) {
        connect();
      } else {
        getDeviceWifiList();
      }
    }
  };

  useEffect(() => {
    if (prevConnected === false && isConnected()) {
      getDeviceWifiList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected()]);

  useEffect(() => {
    if (!success.current) {
      scan(true);
    }
    return () => {
      removeBlufiListeners();
      clearTimeout(timeout.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { loading, error: error.current, step: currentStep, scan, result };
};

export default useDeviceScanWifi;
