import { useState, useEffect, useRef } from 'react';
import useConnectToDevice from './useConnectToDevice';
import Blufi from '../../../BlufiLib';
import { BlufiCallback } from '../../../BlufiLib/util/params';

const STEPS = {
  GETDEVICEWIFILIST: 'getDeviceWifiList',
  DONE: 'done'
}

const ERRORS = {
  FAILEDGETDEVICEWIFILIST: 'failedGetDeviceWifiList',
  FAILEDGETDEVICEWIFILISTTIMEOUT: 'failedGetDeviceWifiListTimeout',
  GENERIC: 'generic'
}

const timeoutLimit = 5000;
const useDeviceScanWifi = (selectedDevice) => {
  const {
    loading: connectionLoading,
    error: connectionError,
    step: connectionStep,
    connect,
    connected } = useConnectToDevice(selectedDevice);
  const [ result, setResult ] = useState([]);
  const [ step, setStep ] = useState(STEPS.GETDEVICEWIFILIST);
  const timeout = useRef(null);
  const success = useRef(false);

  let error = Object.values(ERRORS).includes(step) || connectionError;
  const currentStep = connectionLoading ? connectionStep : step;
  const done = step === STEPS.DONE;
  const loading = !done && !error;

  const removeBlufiListeners = () => {
    Blufi.onError = () => {}
    Blufi.onDeviceScanResult = () => {}
  }

  const addBlufiListeners = () => {
    Blufi.onError = () => {
      clearTimeout(timeout.current);
      if(!error){
        error = true;
        setStep(ERRORS.GENERIC);
      }
    }

    Blufi.onDeviceScanResult = async (status, data) => {
      if(error){
        return;
      }
      if(status === BlufiCallback.STATUS_SUCCESS){
        success.current = true;
        clearTimeout(timeout.current);
        setStep(STEPS.DONE);
        setResult(data.sort((a,b) => b.rssi - a.rssi));
      } else {
        setStep(ERRORS.FAILEDGETDEVICEWIFILIST);
      }
    }
  }

  const getDeviceWifiList = () => {
    addBlufiListeners();
    setStep(STEPS.GETDEVICEWIFILIST);
    Blufi.requestDeviceWifiScan();
    timeout.current = setTimeout(() => {
      // device did not send back network id
      setStep(ERRORS.FAILEDGETDEVICEWIFILISTTIMEOUT);
    }, timeoutLimit);
  }

  const scan = async (force) => {
    if(force || !loading){
      if(!connected) {
        connect();
      } else {
        getDeviceWifiList();
      }
    }
  }

  useEffect(() => {
    if(connected){
      getDeviceWifiList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected]);

  useEffect(() => {
    if(!success.current){
      scan(true);
    }
    return () => {
      removeBlufiListeners();
      clearTimeout(timeout.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { loading, error, step: currentStep, scan, result };
}

export default useDeviceScanWifi;
