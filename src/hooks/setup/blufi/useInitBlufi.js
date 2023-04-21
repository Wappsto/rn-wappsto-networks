import { useEffect } from 'react';
import Blufi from '../../../BlufiLib';
import BleManager from 'react-native-ble-manager';
import bleManagerEmitter from './bleManagerEmitter';

const Listener = {
  UPDATE_CHARACTERISTIC: 'BleManagerDidUpdateValueForCharacteristic',
  DISCONNECT_PERIPHERAL: 'BleManagerDisconnectPeripheral',
};

const useInitBlufi = () => {
  useEffect(() => {
    bleManagerEmitter.addListener(
      Listener.UPDATE_CHARACTERISTIC,
      Blufi.onCustomCharacteristicChanged,
    );
    bleManagerEmitter.addListener(Listener.DISCONNECT_PERIPHERAL, Blufi.reset);
    return () => {
      bleManagerEmitter.removeAllListeners(
        Listener.UPDATE_CHARACTERISTIC,
        //Blufi.onCustomCharacteristicChanged, // removeAllListeners doesn't take callback
      );
      bleManagerEmitter.removeAllListeners(
        Listener.DISCONNECT_PERIPHERAL,
        // Blufi.reset, // removeAllListeners doesn't take a callback
      );

      if (Blufi.connectedDevice) {
        BleManager.disconnect(Blufi.connectedDevice.id);
      }
      Blufi.reset();
    };
  }, []);
};

export default useInitBlufi;
