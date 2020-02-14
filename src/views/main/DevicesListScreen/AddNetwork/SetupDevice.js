import React, { useState, useEffect, useRef } from 'react';
import { NativeModules, NativeEventEmitter, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import BleManager from 'react-native-ble-manager';
import Blufi from '@/BlufiLib';
import { BlufiParameter, BlufiCallback } from '@/BlufiLib/util/params';
import i18n, { CapitalizeFirst } from '@/translations';
import theme from '@/theme/themeExport';
import { isUUID } from 'wappsto-redux/util/helpers';
import RequestError from '@/components/RequestError';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const STEPS = {
  CONNECT: 'connect',
  RETRIEVE: 'retrieve',
  INITNOTIFICATION: 'initNotification',
  NEGOCIATESECURITY: 'negotiateSecurity',
  SENDWIFIDATA: 'sendWifiData',
  WAITDEVICECONNECT: 'waitDeviceConnect',
  ADDNETWORK: 'addNetwork'
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
  FAILEDADDNETWORK: 'failedAddNetwork',
  GENERIC: 'generic'
}

const timeoutLimit = 10000;
const SetupDevice = React.memo(({ next, previous, hide, ssid, password, selectedDevice, sendRequest, postRequest, skipCodes }) => {
  const [ step, setStep ] = useState(STEPS.CONNECT);
  const networkId = useRef(null);
  const timeout = useRef(null);

  let error = Object.values(ERRORS).includes(step);
  const done = step === 'done';
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

    Blufi.onReceiveCustomData = async (status, data) => {
      if(error){
        return;
      }
      try{
        clearTimeout(timeout.current);
        networkId.current = data.toString();
        if(!isUUID(networkId.current)){
          // message is not a uuid
          setStep(ERRORS.FAILEDNOTUUID);
          return;
        }
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

    Blufi.onStatusResponse = () => {
      if(error){
        return;
      }
      // Device connected!
      clearTimeout(timeout.current);
      setStep(STEPS.ADDNETWORK);
      sendRequest(networkId.current);
      // setStep('done');
    }
  }


  const configure = async () => {
    try {
      Blufi.reset();
      addBlufiListeners();
      setStep(STEPS.CONNECT);
      await BleManager.connect(selectedDevice.id);
      Blufi.setConnectedDevice(selectedDevice);
      setStep(STEPS.INITNOTIFICATION);
      await BleManager.retrieveServices(selectedDevice.id);
      await BleManager.startNotification(selectedDevice.id, BlufiParameter.UUID_SERVICE, BlufiParameter.UUID_NOTIFICATION_CHARACTERISTIC);
      setStep(STEPS.NEGOCIATESECURITY);
      Blufi.negotiateSecurity(selectedDevice);
      timeout.current = setTimeout(() => {
        // device did not negociate security
        setStep(ERRORS.FAILEDNEGOCIATESECURITYTIMEOUT);
      }, timeoutLimit);
    } catch (e) {
      setStep(ERRORS.FAILEDNEGOCIATESECURITY);
    }
  }

  useEffect(() => {
    configure();
    return () => {
      removeBlufiListeners();
      BleManager.disconnect(selectedDevice.id);
      Blufi.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <Text style={[theme.common.H3, error && theme.common.error]}>{CapitalizeFirst(i18n.t(loading ? 'blufi.settingUp' : (error ? 'blufi.error.title' : 'blufi.done')))}</Text>
      {loading && (
        <>
          <ActivityIndicator size='large' color={theme.variables.primary} style={theme.common.spaceAround}/>
          <Text>{CapitalizeFirst(i18n.t('blufi.step.' + step))}</Text>
        </>
      )}
      {error && <Text style={theme.common.error}>{CapitalizeFirst(i18n.t('blufi.error.' + step))}</Text>}
      <RequestError request={postRequest} skipCodes={skipCodes} />
      {!loading && !error &&
        <>
          <Text>{CapitalizeFirst(i18n.t('blufi.doneDescription'))}</Text>
          <TouchableOpacity onPress={hide}>
            <Text style={theme.common.success}>{CapitalizeFirst(i18n.t('done'))}</Text>
          </TouchableOpacity>
        </>
      }
    </>
  );
});

export default SetupDevice;
