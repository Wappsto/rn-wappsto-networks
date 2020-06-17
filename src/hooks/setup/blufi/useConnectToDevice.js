import { useState, useEffect, useRef } from 'react';
import BleManager from 'react-native-ble-manager';
import Blufi from '../../../BlufiLib';
import { BlufiParameter, BlufiCallback } from '../../../BlufiLib/util/params';

const STEPS = {
  CONNECT: 'connect',
  INITNOTIFICATION: 'initNotification',
  NEGOCIATESECURITY: 'negotiateSecurity',
  CONNECTED: 'connected'
}

const ERRORS = {
  FAILEDCONNECT: 'failedConnect',
  FAILEDINITNOTIFICATION: 'failedInitNotification',
  FAILEDNEGOCIATESECURITY: 'failedNegotiateSecurity',
  FAILEDNEGOCIATESECURITYTIMEOUT: 'failedNegotiateSecurityTimeout',
  GENERIC: 'generic'
}

let deviceId;
const timeoutLimit = 10000;
const useConnectToDevice = (selectedDevice) => {
  const [ step, setStep ] = useState(STEPS.CONNECT);
  const timeout = useRef(null);
  const success = useRef(false);
  const error = useRef(false);

  error.current = Object.values(ERRORS).includes(step);
  const connected = Blufi.connectedDevice
                  && Blufi.connectedDevice.id === selectedDevice.id
                  && deviceId === selectedDevice.id;
  const loading = selectedDevice && !connected && !error.current;

  const removeBlufiListeners = () => {
    Blufi.onError = () => {}
    Blufi.onNegotiateSecurityResult = () => {}
  }

  const addBlufiListeners = () => {
    Blufi.onError = () => {
      clearTimeout(timeout.current);
      if(!error.current){
        error.current = true;
        setStep(ERRORS.GENERIC);
      }
    }

    Blufi.onNegotiateSecurityResult = (status) => {
      if(error.current){
        return;
      }
      clearTimeout(timeout.current);
      if(status === BlufiCallback.STATUS_SUCCESS){
        deviceId = selectedDevice.id;
        success.current = true;
        clearTimeout(timeout.current);
        setStep(STEPS.CONNECTED);
      } else {
        setStep(ERRORS.FAILEDNEGOCIATESECURITY);
      }
    }
  }

  const initConnection = async () => {
    try {
      Blufi.reset();
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
      setStep(STEPS.NEGOCIATESECURITY);
      Blufi.negotiateSecurity();
      timeout.current = setTimeout(() => {
        // device did not negociate security
        setStep(ERRORS.FAILEDNEGOCIATESECURITYTIMEOUT);
      }, timeoutLimit);
    } catch (e) {
      setStep(ERRORS.FAILEDNEGOCIATESECURITY);
      return;
    }
  }

  const disconnect = () => {
    setStep(STEPS.CONNECT);
    deviceId = null;
    success.current = false;
    if(selectedDevice && selectedDevice.id){
      BleManager.disconnect(selectedDevice.id);
    }
    Blufi.reset();
  }

  const connect = (force) => {
    if(selectedDevice && selectedDevice.id && (force || !loading)){
      addBlufiListeners();
      if(!deviceId || !Blufi.connectedDevice || Blufi.connectedDevice.id !== deviceId || Blufi.connectedDevice.id !== selectedDevice.id){
        disconnect();
        initConnection();
      }
    }
  }

  useEffect((selectedDevice) => {
    if(!success.current){
      connect(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDevice]);

  useEffect(() => {
    if(!success.current){
      connect(true);
    }
    return () => {
      removeBlufiListeners();
      clearTimeout(timeout.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { loading, error: error.current, step, connect, disconnect, connected };
}

export default useConnectToDevice;
