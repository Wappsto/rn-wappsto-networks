import { useState, useEffect, useRef } from 'react';
import useConnectToDevice from './useConnectToDevice';
import Blufi from '../../../BlufiLib';
import { BlufiCallback } from '../../../BlufiLib/util/params';
import usePrevious from 'wappsto-blanket/hooks/usePrevious';

const STEPS = {
  GETDEVICEWIFILIST: 'getDeviceWifiList',
  DONE: 'done'
}

const ERRORS = {
  FAILEDGETDEVICEWIFILIST: 'failedGetDeviceWifiList',
  FAILEDGETDEVICEWIFILISTTIMEOUT: 'failedGetDeviceWifiListTimeout',
  GENERIC: 'generic'
}

const timeoutLimit = 10000;
const useDeviceScanWifi = (selectedDevice) => {
  const {
    loading: connectionLoading,
    error: connectionError,
    step: connectionStep,
    connect,
    connected } = useConnectToDevice(selectedDevice);
  const prevConnected = usePrevious(connected);
  const [ result, setResult ] = useState([]);
  const [ step, setStep ] = useState(STEPS.GETDEVICEWIFILIST);
  const timeout = useRef(null);
  const success = useRef(false);
  const error = useRef(false);

  error.current = Object.values(ERRORS).includes(step) || connectionError;
  const currentStep = connectionLoading ? connectionStep : step;
  const done = step === STEPS.DONE;
  const loading = !done && !error.current;

  const removeBlufiListeners = () => {
    Blufi.onError = () => {}
    Blufi.onDeviceScanResult = () => {}
  }

  const addBlufiListeners = () => {
    Blufi.onError = () => {
      clearTimeout(timeout.current);
      if(!error.current){
        error.current = true;
        setStep(ERRORS.GENERIC);
      }
    }

    Blufi.onDeviceScanResult = async (status, data) => {
      if(error.current){
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
    if(prevConnected === false && connected){
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

  return { loading, error: error.current, step: currentStep, scan, result };
}

export default useDeviceScanWifi;
