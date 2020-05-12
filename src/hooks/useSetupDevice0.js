import { useState, useEffect, useRef } from 'react';
import useConnectToDevice from './useConnectToDevice';
import BleManager from 'react-native-ble-manager';
import Blufi from '../BlufiLib';
import { BlufiCallback } from '../BlufiLib/util/params';
import { isUUID } from 'wappsto-redux/util/helpers';

const STEPS = {
  RETRIEVE: 'retrieve',
  SENDWIFIDATA: 'sendWifiData',
  WAITDEVICECONNECT: 'waitDeviceConnect',
  ADDNETWORK: 'addNetwork',
  DONE: 'done'
}

const ERRORS = {
  FAILEDRETRIEVE: 'failedRetrieve',
  FAILEDRETRIEVETIMEOUT: 'failedRetrieveTimeout',
  FAILEDNOTUUID: 'failedNotUuid',
  FAILEDSENDWIFIDATA: 'failedSendWifiData',
  FAILEDWAITDEVICECONNECT: 'failedWaitDeviceConnect',
  REJECTEDMANUFACTURERASOWNER: 'rejectedManufacturerAsOwner',
  RSERROR: 'rserror',
  GENERIC: 'generic'
}

const timeoutLimit = 10000;
const useSetupDevice = (selectedDevice, sendRequest, postRequest, acceptedManufacturerAsOwner, ssid, password) => {
  const {
    loading: connectionLoading,
    error: connectionError,
    step: connectionStep,
    connect,
    connected } = useConnectToDevice(selectedDevice);
  const [ step, setStep ] = useState(STEPS.RETRIEVE);
  const networkId = useRef(null);
  const timeout = useRef(null);
  const success = useRef(false);

  let error = Object.values(ERRORS).includes(step) || connectionError;
  const currentStep = connectionLoading ? connectionStep : step;
  const done = step === STEPS.DONE;
  const loading = !done && !error;

  const removeBlufiListeners = () => {
    Blufi.onError = () => {}
    Blufi.onReceiveCustomData = async (status, data) => {}
    Blufi.onStatusResponse = () => {}
  }

  const addBlufiListeners = () => {
    Blufi.onError = () => {
      clearTimeout(timeout.current);
      if(!error){
        error = true;
        setStep(ERRORS.GENERIC);
      }
    }

    Blufi.onReceiveCustomData = async (status, data) => {
      if(error){
        return;
      }
      if(status === BlufiCallback.STATUS_SUCCESS){
        clearTimeout(timeout.current);
        networkId.current = "42514bd9-0ca0-4a7d-b852-7b94bd3da07d"; //data.toString();
        if(!isUUID(networkId.current)){
          // message is not a uuid
          setStep(ERRORS.FAILEDNOTUUID);
          return;
        }
        setStep(STEPS.ADDNETWORK);
        sendRequest(networkId.current);
      } else {
        setStep(ERRORS.GENERIC);
      }
    }

    Blufi.onStatusResponse = (status) => {
      if(error){
        return;
      }
      if(status === BlufiCallback.STATUS_SUCCESS){
        // Device connected!
        success.current = true;
        clearTimeout(timeout.current);
        setStep(STEPS.DONE);
      }
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

  const startConfigure = async () => {
    try{
      addBlufiListeners();
      setStep(STEPS.RETRIEVE);
      Blufi.postCustomData('network_id');
      timeout.current = setTimeout(() => {
        // device did not send back network id
        setStep(ERRORS.FAILEDRETRIEVETIMEOUT);
      }, timeoutLimit);
    } catch (e) {
      setStep(ERRORS.GENERIC);
      return;
    }
  }

  const configure = async (force) => {
    if(force || !loading){
      if(!connected) {
        connect();
      } else {
        startConfigure();
      }
    }
  }

  useEffect(() => {
    if(connected){
      startConfigure();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected]);

  useEffect(() => {
    if(!success.current){
      configure(true);
    }
    return () => {
      removeBlufiListeners();
      clearTimeout(timeout.current);
      networkId.current = null;
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

  return { loading, error, step: currentStep, configure };
}

export default useSetupDevice;
