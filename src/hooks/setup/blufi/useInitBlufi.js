import { useEffect } from 'react';
import Blufi from '../../../BlufiLib';
import BleManager from 'react-native-ble-manager';
import bleManagerEmitter from './bleManagerEmitter';

const useInitBlufi = () => {
  useEffect(() => {
    bleManagerEmitter.addListener(
      'BleManagerDidUpdateValueForCharacteristic',
      Blufi.onCustomCharacteristicChanged,
    );
    bleManagerEmitter.addListener('BleManagerDisconnectPeripheral', Blufi.reset);
    return () => {
      bleManagerEmitter.removeListener(
        'BleManagerDidUpdateValueForCharacteristic',
        Blufi.onCustomCharacteristicChanged,
      );
      bleManagerEmitter.removeListener('BleManagerDisconnectPeripheral', Blufi.reset);
      if (Blufi.connectedDevice) {
        BleManager.disconnect(Blufi.connectedDevice.id);
      }
      Blufi.reset();
    };
  }, []);
};

export default useInitBlufi;
