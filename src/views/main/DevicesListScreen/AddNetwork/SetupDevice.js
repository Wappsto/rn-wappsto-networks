import React, { useState, useEffect, useRef } from 'react';
import { NativeModules, NativeEventEmitter, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import BleManager from 'react-native-ble-manager';
import Blufi from '@/BlufiLib';
import { BlufiParameter, BlufiCallback } from '@/BlufiLib/util/params';
import i18n, { CapitalizeFirst } from '@/translations';
import theme from '@/theme/themeExport';

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

const timeoutLimit = 10000;
const SetupDevice = React.memo(({ next, previous, hide, ssid, password, selectedDevice }) => {
  const [ step, setStep ] = useState('pending');
  const listening = useRef(false);
  const networkId = useRef(null);
  const timeout = useRef(null);

  const addBlufiListeners = () => {
    if(!listening.current){
      listening.current = true;
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
    }

    Blufi.onError = () => {
      clearTimeout(timeout.current);
      setStep('error');
    }

    Blufi.onReceiveCustomData = async (data) => {
      clearTimeout(timeout.current);
      networkId.current = data;
      setStep(STEPS.SENDWIFIDATA);
      await Blufi.configure(selectedDevice, ssid, password);
      setStep(STEPS.WAITDEVICECONNECT);
      timeout.current = setTimeout(() => {
        // device did not connect
        setStep('error');
      }, timeoutLimit);
    }

    Blufi.onNegotiateSecurityResult = (result) => {
      clearTimeout(timeout.current);
      if(result === BlufiCallback.STATUS_SUCCESS){
        setStep(STEPS.RETRIEVE);
        Blufi.postCustomData('network_id');
        timeout.current = setTimeout(() => {
          // device did not send back network id
          setStep('error');
        }, timeoutLimit);
      } else {
        setStep('error');
      }
    }

    Blufi.onStatusResponse = () => {
      // Device connected!
      clearTimeout(timeout.current);
      // setStep(STEPS.ADDNETWORK);
      setStep('done');
    }
  }

  const configure = async () => {
    try {
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
        setStep('error');
      }, timeoutLimit);
    } catch (e) {
      setStep('error');
    }
  }

  useEffect(() => {
    configure();
    return () => {
      BleManager.disconnect(selectedDevice.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const done = step === 'done';
  const error = step === 'error';
  const loading = !done && !error;
  return (
    <>
      <Text>{CapitalizeFirst(i18n.t(loading ? 'blufi.settingUp' : (error ? 'blufi.error' : 'blufi.done')))}</Text>
      {loading && (
        <>
          <ActivityIndicator size='large' color={theme.variables.primary} />
          <Text>{CapitalizeFirst(i18n.t('blufi.step.' + step))}</Text>
        </>
      )}
      {error && <Text>{CapitalizeFirst(i18n.t('blufi.errorDescription'))}</Text>}
      {!loading && !error &&
        <>
          <Text>{CapitalizeFirst(i18n.t('blufi.doneDescription'))}</Text>
          <TouchableOpacity onPress={hide}>
            <Text>{CapitalizeFirst(i18n.t('done'))}</Text>
          </TouchableOpacity>
        </>
      }
    </>
  );
});

export default SetupDevice;
