import { useState, useEffect, useRef } from 'react';
import useConnectToDevice from './useConnectToDevice';
import Blufi from '../../../BlufiLib';
import { BlufiCallback } from '../../../BlufiLib/util/params';
import { isUUID } from 'wappsto-redux/util/helpers';
import usePrevious from 'wappsto-blanket/hooks/usePrevious';

export const STEPS = {
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

const timeoutLimit = 30000;
const useSetupDevice = (connectToDevice, addNetworkHandler, wifiFields, autoConfigure, isBlufi = true) => {
  const { sendRequest, request, acceptedManufacturerAsOwner } = addNetworkHandler;
  const { ssid, password } = wifiFields;
  const {
    loading: connectionLoading,
    error: connectionError,
    step: connectionStep,
    connect,
    connected } = connectToDevice;
  const prevConnected = usePrevious(connected);
  const [ step, setStep ] = useState(STEPS.RETRIEVE);
  const networkId = useRef(null);
  const timeout = useRef(null);
  const success = useRef(false);
  const error = useRef(false);

  error.current = Object.values(ERRORS).includes(step) || connectionError;
  const currentStep = (connectionLoading || connectionError) ? connectionStep : step;
  const done = step === STEPS.DONE;
  const loading = !done && !error.current;

  const reset = () => {
    clearTimeout(timeout.current);
    networkId.current = null;
    success.current = false;
  }

  const removeBlufiListeners = () => {
    Blufi.onError = () => {}
    Blufi.onReceiveCustomData = async (status, data) => {}
    Blufi.onStatusResponse = () => {}
  }

  const addBlufiListeners = () => {
    Blufi.onError = () => {
      clearTimeout(timeout.current);
      if(!error.current){
        error.current = true;
        setStep(ERRORS.GENERIC);
      }
    }

    Blufi.onReceiveCustomData = async (status, data) => {
      if(error.current){
        return;
      }
      if(status === BlufiCallback.STATUS_SUCCESS){
        clearTimeout(timeout.current);
        networkId.current = data.toString();
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
      if(error.current){
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
      reset();
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
        if(!connectionLoading){
          connect();
        }
      } else {
        startConfigure();
      }
    }
  }

  useEffect(() => {
    if(prevConnected === false && connected && autoConfigure){
      configure(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected]);

  useEffect(() => {
    if(!success.current && autoConfigure){
      configure(true);
    }
    return () => {
      removeBlufiListeners();
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if(step === STEPS.ADDNETWORK && request){
      if(request.status === 'success'){
        if(isBlufi){
          sendWifiData();
        } else {
          networkId.current = request.json && request.json.meta && request.json.meta.id;
          success.current = true;
          setStep(STEPS.DONE);
        }
      } else if(request.status === 'error'){
        if(acceptedManufacturerAsOwner === false){
          setStep(ERRORS.REJECTEDMANUFACTURERASOWNER);
        } else if(acceptedManufacturerAsOwner === true){
          setStep(ERRORS.RSERROR);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [request, acceptedManufacturerAsOwner]);

  return {
    configure,
    loading,
    setStep,
    error: error.current,
    step: currentStep,
    request: addNetworkHandler.request,
    networkId: networkId.current
  };
}

export default useSetupDevice;
