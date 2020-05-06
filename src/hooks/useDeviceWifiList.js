import { useState, useEffect, useRef } from 'react';
import { NativeModules, NativeEventEmitter } from 'react-native';
import BleManager from 'react-native-ble-manager';
import Blufi from '../BlufiLib';
import { BlufiParameter } from '../BlufiLib/util/params';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const STEPS = {
  CONNECT: 'connect',
  RETRIEVE: 'retrieve',
  INITNOTIFICATION: 'initNotification',
  GETDEVICEWIFILIST: 'getDeviceWifiList',
  DONE: 'done'
}

const ERRORS = {
  FAILEDCONNECT: 'failedConnect',
  FAILEDINITNOTIFICATION: 'failedInitNotification',
  FAILEDGETDEVICEWIFILIST: 'failedGetDeviceWifiList',
  FAILEDGETDEVICEWIFILISTTIMEOUT: 'failedGetDeviceWifiListTimeout'
}

const timeoutLimit = 10000;
const useDeviceWifiList = (selectedDevice) => {
  const [ result, setResult ] = useState([]);
  const [ step, setStep ] = useState(STEPS.CONNECT);
  const timeout = useRef(null);
  const success = useRef(false);

  let error = Object.values(ERRORS).includes(step);
  const done = step === STEPS.DONE;
  const loading = !done && !error;

  const removeBlufiListeners = () => {
    bleManagerEmitter.removeAllListeners('BleManagerDidUpdateValueForCharacteristic');
    bleManagerEmitter.removeAllListeners('BleManagerDisconnectPeripheral');
    Blufi.onError = () => {}
    Blufi.onReceiveCustomData = async (status, data) => {}
  }

  const addBlufiListeners = () => {
    bleManagerEmitter.addListener(
      'BleManagerDidUpdateValueForCharacteristic',
      ({ value }) => {
          Blufi.onCharacteristicChanged(value);
      }
    );

    bleManagerEmitter.addListener(
      'BleManagerDisconnectPeripheral',
      () => {
          Blufi.reset();
      }
    );

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
      success.current = true;
      clearTimeout(timeout.current);
      setStep(STEPS.DONE);
      setResult(data);
    }
  }

  const getDeviceWifiList = async () => {
    try {
      Blufi.reset();
      addBlufiListeners();
      setStep(STEPS.CONNECT);
      await BleManager.connect(selectedDevice.id);
    } catch(e) {
      setStep(ERRORS.FAILEDCONNECT);
      return;
    }
    try {
      Blufi.setConnectedDevice(selectedDevice);
      setStep(STEPS.INITNOTIFICATION);
      await BleManager.retrieveServices(selectedDevice.id);
      await BleManager.startNotification(selectedDevice.id, BlufiParameter.UUID_SERVICE, BlufiParameter.UUID_NOTIFICATION_CHARACTERISTIC);
    } catch(e){
      setStep(ERRORS.FAILEDINITNOTIFICATION);
      return;
    }
    try{
      setStep(STEPS.GETDEVICEWIFILIST);
      Blufi.requestDeviceWifiScan();
      timeout.current = setTimeout(() => {
        // device did not negociate security
        setStep(ERRORS.FAILEDGETDEVICEWIFILISTTIMEOUT);
      }, timeoutLimit);
    } catch (e) {
      setStep(ERRORS.FAILEDGETDEVICEWIFILIST);
      return;
    }
  }

  useEffect(() => {
    if(!success.current){
      getDeviceWifiList();
    }
    return () => {
      removeBlufiListeners();
      BleManager.disconnect(selectedDevice.id);
      Blufi.reset();
      timeout.current = null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { loading, error, step, getDeviceWifiList, result };
}

export default useDeviceWifiList;
