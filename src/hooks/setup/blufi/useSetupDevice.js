import { useState, useEffect, useRef } from 'react';
import Blufi from '../../../BlufiLib';
import { BlufiCallback } from '../../../BlufiLib/util/params';
import { isUUID } from 'wappsto-redux/util/helpers';
import usePrevious from 'wappsto-blanket/hooks/usePrevious';
import { manufacturerAsOwnerErrorCode } from '../../../util/params';

const BLUFI_STATUS = {
  IDLE: 'idle',
  STA_CONNECTING: 'sta_connecting',
  STA_CONNECTED: 'sta_connected',
  OTA_CHECKING: 'ota_checking',
  OTA_DOWNLOADING: 'ota_downloading',
  OTA_UPGRADING: 'ota_upgrading',
  NTP_SYNC: 'ntp_sync',
  WAPPSTO_DELETING: 'wappsto_deleting',
  WAPPSTO_CONNECTING: 'wappsto_connecting',
  WAPPSTO_CONNECTED: 'wappsto_connected',
  WAPPSTO_READY: 'wappsto_ready',
  UNKNOWN: 'unknown',
  INVALID_COMMAND: 'Invalid command'
}

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

const statusPollTime = 1000;
const addNetworkTimeout = 5000; // in case device does not support status WAPPSTO_READY, wait this time then add
const timeoutLimit = 30000;
const useSetupDevice = (connectToDevice, addNetworkHandler, wifiFields, autoConfigure) => {
  const { sendRequest, request, acceptedManufacturerAsOwner } = addNetworkHandler;
  const { ssid, password } = wifiFields;
  const {
    loading: connectionLoading,
    error: connectionError,
    step: connectionStep,
    connect,
    isConnected } = connectToDevice;
  const prevConnected = usePrevious(isConnected());
  const [ step, setStateStep ] = useState(STEPS.RETRIEVE);
  const networkId = useRef(null);
  const timeout = useRef(null);
  const statusInterval = useRef(null);
  const waitForStatus = useRef(true);
  const deviceConnectedToWifi = useRef(false);
  const withTimeout = useRef(true);
  const refStep = useRef(step);
  const success = useRef(false);
  const error = useRef(false);

  const setStep = (val) => {
    refStep.current = val;
    setStateStep(val);
  }

  error.current = Object.values(ERRORS).includes(step) || connectionError;
  const currentStep = (connectionLoading || connectionError) ? connectionStep : step;
  const done = step === STEPS.DONE;
  const loading = !done && !error.current;

  const reset = () => {
    clearTimeout(timeout.current);
    clearInterval(statusInterval.current);
    networkId.current = null;
    success.current = false;
    waitForStatus.current = true;
    deviceConnectedToWifi.current = false;
  }

  const removeBlufiListeners = () => {
    Blufi.onError = () => {}
    Blufi.onReceiveCustomData = async (status, data) => {}
    Blufi.onStatusResponse = () => {}
  }

  const addNetwork = () => {
    setStep(STEPS.ADDNETWORK);
    sendRequest(networkId.current);
  }

  const addStatusPoll = () => {
    let gettingStatus = false;
    statusInterval.current = setInterval(async () => {
      if(error.current){
        clearInterval(statusInterval.current);
      } else if(!isConnected()){
        clearInterval(statusInterval.current);
        if(deviceConnectedToWifi.current){
          if(withTimeout.current){
            setTimeout(addNetwork, addNetworkTimeout);
          } else {
            addNetwork();
          }
        }
      } else if(!gettingStatus) {
        // prevent multiple write
        gettingStatus = true;
        try{
          await Blufi.postCustomData('status');
        } catch(e){

        }
        gettingStatus = false;
      }
    }, statusPollTime);
  }

  const sendWifiData = async () => {
    try{
      setStep(STEPS.SENDWIFIDATA);
      await Blufi.configure(ssid, password);
      setStep(STEPS.WAITDEVICECONNECT);
      addStatusPoll();
      timeout.current = setTimeout(() => {
        // device did not connect
        setStep(ERRORS.FAILEDWAITDEVICECONNECT);
      }, timeoutLimit);
    } catch(e) {
      setStep(ERRORS.FAILEDSENDWIFIDATA);
    }
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
        const message = data.toString();
        if(refStep.current === STEPS.RETRIEVE){
          clearTimeout(timeout.current);
          networkId.current = message;
          if(!isUUID(networkId.current)){
            // message is not a uuid
            setStep(ERRORS.FAILEDNOTUUID);
            return;
          }
          sendWifiData();
        } else if(refStep.current === STEPS.WAITDEVICECONNECT){
          if(message === BLUFI_STATUS.INVALID_COMMAND){
            clearInterval(statusInterval.current);
            waitForStatus.current = false;
            if(deviceConnectedToWifi.current){
              setTimeout(addNetwork, addNetworkTimeout);
            }
          } if(message.includes('wappsto') || message.includes('ota')){
            // new version, setting this in case we miss status update
            withTimeout.current = false;
          }
        }
      } else {
        setStep(ERRORS.GENERIC);
      }
    }

    Blufi.onStatusResponse = (status) => {
      if(error.current){
        return;
      }
      if(status === BlufiCallback.STATUS_SUCCESS){
        clearTimeout(timeout.current);
        deviceConnectedToWifi.current = true;
        if(!waitForStatus.current){
          setTimeout(addNetwork, addNetworkTimeout);
        }
      }
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
      if(!isConnected()) {
        if(!connectionLoading){
          connect();
        }
      } else {
        startConfigure();
      }
    }
  }

  useEffect(() => {
    if(prevConnected === false && isConnected() && autoConfigure){
      configure(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected()]);

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
    if(refStep.current === STEPS.ADDNETWORK && request){
      if(request.status === 'success'){
        networkId.current = request.json && request.json.meta && request.json.meta.id;
        success.current = true;
        setStep(STEPS.DONE);
      } else if(request.status === 'error'){
        if(request.json && request.json.code === manufacturerAsOwnerErrorCode){
          if(acceptedManufacturerAsOwner === false){
            setStep(ERRORS.REJECTEDMANUFACTURERASOWNER);
          } else if(acceptedManufacturerAsOwner === true){
            setStep(ERRORS.RSERROR);
          }
        } else {
          setStep(ERRORS.RSERROR);
        }
      }
    }
  }, [request, acceptedManufacturerAsOwner]);

  return {
    configure,
    loading,
    setStep,
    error: error.current,
    step: currentStep,
    request: request,
    networkId: networkId.current
  };
}

export default useSetupDevice;
