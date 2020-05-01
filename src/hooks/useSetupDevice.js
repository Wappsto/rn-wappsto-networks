import { useState, useEffect, useRef } from 'react';
import { NativeModules, NativeEventEmitter } from 'react-native';
import BleManager from 'react-native-ble-manager';
import Blufi from '../BlufiLib';
import { BlufiParameter, BlufiCallback } from '../BlufiLib/util/params';
import { isUUID } from 'wappsto-redux/util/helpers';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const STEPS = {
  CONNECT: 'connect',
  RETRIEVE: 'retrieve',
  INITNOTIFICATION: 'initNotification',
  NEGOCIATESECURITY: 'negotiateSecurity',
  SENDWIFIDATA: 'sendWifiData',
  WAITDEVICECONNECT: 'waitDeviceConnect',
  ADDNETWORK: 'addNetwork',
  DONE: 'done'
}

const ERRORS = {
  FAILEDCONNECT: 'failedConnect',
  FAILEDRETRIEVE: 'failedRetrieve',
  FAILEDRETRIEVETIMEOUT: 'failedRetrieveTimeout',
  FAILEDNOTUUID: 'failedNotUuid',
  FAILEDINITNOTIFICATION: 'failedInitNotification',
  FAILEDNEGOCIATESECURITY: 'failedNegotiateSecurity',
  FAILEDNEGOCIATESECURITYTIMEOUT: 'failedNegotiateSecurityTimeout',
  FAILEDSENDWIFIDATA: 'failedSendWifiData',
  FAILEDWAITDEVICECONNECT: 'failedWaitDeviceConnect',
  REJECTEDMANUFACTURERASOWNER: 'rejectedManufacturerAsOwner',
  RSERROR: 'rserror',
  GENERIC: 'generic'
}

const timeoutLimit = 10000;
const useSetupDevice = (selectedDevice, sendRequest, postRequest, acceptedManufacturerAsOwner, ssid, password) => {
  const [ step, setStep ] = useState(STEPS.CONNECT);
  const networkId = useRef(null);
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
    Blufi.onNegotiateSecurityResult = (result) => {}
    Blufi.onStatusResponse = () => {}
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

    Blufi.onNegotiateSecurityResult = (result) => {
      if(error){
        return;
      }
      clearTimeout(timeout.current);
      if(result === BlufiCallback.STATUS_SUCCESS){
        setStep(STEPS.RETRIEVE);
        Blufi.postCustomData('network_id');
        timeout.current = setTimeout(() => {
          // device did not send back network id
          setStep(ERRORS.FAILEDRETRIEVETIMEOUT);
        }, timeoutLimit);
      } else {
        setStep(ERRORS.FAILEDRETRIEVE);
      }
    }

    Blufi.onReceiveCustomData = async (status, data) => {
      if(error){
        return;
      }
      clearTimeout(timeout.current);
      networkId.current = data.toString();
      if(!isUUID(networkId.current)){
        // message is not a uuid
        setStep(ERRORS.FAILEDNOTUUID);
        return;
      }
      setStep(STEPS.ADDNETWORK);
      sendRequest(networkId.current);
    }

    Blufi.onStatusResponse = () => {
      if(error){
        return;
      }
      // Device connected!
      success.current = true;
      clearTimeout(timeout.current);
      setStep(STEPS.DONE);
    }
  }

  const sendWifiData = async () => {
    try{
      setStep(STEPS.SENDWIFIDATA);
      await Blufi.configure(ssid, password);
      setStep(STEPS.WAITDEVICECONNECT);
      timeout.current = setTimeout(() => {
        // device did not connect
        setStep(ERRORS.FAILEDWAITDEVICECONNECT);
      }, timeoutLimit);
    } catch(e) {
      setStep(ERRORS.FAILEDSENDWIFIDATA);
    }
  }

  const configure = async () => {
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
      console.log(e);
      setStep(ERRORS.FAILEDINITNOTIFICATION);
      return;
    }
    try{
      setStep(STEPS.NEGOCIATESECURITY);
      Blufi.negotiateSecurity(selectedDevice);
      timeout.current = setTimeout(() => {
        // device did not negociate security
        setStep(ERRORS.FAILEDNEGOCIATESECURITYTIMEOUT);
      }, timeoutLimit);
    } catch (e) {
      setStep(ERRORS.FAILEDNEGOCIATESECURITY);
      return;
    }
  }

  useEffect(() => {
    if(!success.current){
      configure();
    }
    return () => {
      removeBlufiListeners();
      BleManager.disconnect(selectedDevice.id);
      Blufi.reset();
      networkId.current = null;
      timeout.current = null;
      success.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if(step === STEPS.ADDNETWORK && postRequest){
      if(postRequest.status === 'success'){
        sendWifiData();
      } else if(postRequest.status === 'error'){
        if(acceptedManufacturerAsOwner === false){
          setStep(ERRORS.REJECTEDMANUFACTURERASOWNER);
        } else {
          setStep(ERRORS.RSERROR);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postRequest, acceptedManufacturerAsOwner]);

  return { loading, error, step };
}

export default useSetupDevice;
