import { useEffect, useState, useCallback } from 'react';
import { Platform, Linking, PermissionsAndroid } from 'react-native';
import BleManager from 'react-native-ble-manager';
import { config } from '../../../configureWappstoRedux';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import bleManagerEmitter from './bleManagerEmitter';

export const PERMISSION_ERRORS = {
  BLUETOOTH_UNAUTHORIZED: 'bluetoothUnauthorized',
  BLUETOOTH_NOT_SUPPORTED: 'bluetoothNotSupported',
  BLUETOOTH_OFF: 'bluetoothOff',
  BLUETOOTH_GENERIC: 'bluetoothGeneric',
  LOCATION: 'location',
};

const Listener = {
  DISCOVER_PERIPHERAL: 'BleManagerDiscoverPeripheral',
  STOP_SCAN: 'BleManagerStopScan',
  UPDATE_STATE: 'BleManagerDidUpdateState',
};

const useSearchBlufi = () => {
  const [error, setError] = useState(false);
  const [permissionError, setPermissionError] = useState('');
  const [scanning, setScanning] = useState(true);
  const [devices, setDevices] = useState([]);
  const [canScan, setCanScan] = useState(true);

  const removeDiscoveryListener = useCallback(() => {
    bleManagerEmitter.removeAllListeners(Listener.DISCOVER_PERIPHERAL);
    bleManagerEmitter.removeAllListeners(Listener.STOP_SCAN);
  }, []);

  const addDiscoveryListener = useCallback(() => {
    // Get discovered peripherals
    bleManagerEmitter.addListener(Listener.DISCOVER_PERIPHERAL, device => {
      if (config.blufiFilterEmptyName && !device.name) {
        return;
      }
      const lowerName = device.name ? device.name.toLowerCase() : '';
      setDevices(oldDevices => {
        if (
          (!config.blufiFilter ||
            config.blufiFilter.length === 0 ||
            config.blufiFilter.find(f => lowerName.includes(f.toLowerCase()))) &&
          !oldDevices.find(d => d.id === device.id)
        ) {
          return [...oldDevices, device].sort((a, b) => b.rssi - a.rssi);
        }
        return oldDevices;
      });
    });

    // Scan stopped
    bleManagerEmitter.addListener(Listener.STOP_SCAN, () => {
      removeDiscoveryListener();
      setScanning(false);
    });
  }, [removeDiscoveryListener]);

  const getAndroidPermissions = useCallback(async () => {
    if (Platform.Version > 30) {
      const result = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ]);

      if (
        result[PERMISSIONS.ANDROID.BLUETOOTH_SCAN] !== RESULTS.GRANTED ||
        result[PERMISSIONS.ANDROID.BLUETOOTH_CONNECT] !== RESULTS.GRANTED
      ) {
        throw PERMISSION_ERRORS.BLUETOOTH_GENERIC;
      }
    } else if (Platform.Version >= 23) {
      const result = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      if (result !== RESULTS.GRANTED) {
        throw PERMISSION_ERRORS.LOCATION;
      }
    }
  }, []);

  const enableBluetoothIOS = useCallback(async () => {
    let bluetoothState;
    try {
      bluetoothState = await request(PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL);
    } catch (e) {
      throw PERMISSION_ERRORS.BLUETOOTH_GENERIC;
    }
    switch (bluetoothState) {
      case RESULTS.UNAVAILABLE:
        throw PERMISSION_ERRORS.BLUETOOTH_OFF;
      case RESULTS.DENIED:
      case RESULTS.BLOCKED:
        throw PERMISSION_ERRORS.BLUETOOTH_UNAUTHORIZED;
      default:
        break;
    }
  }, []);

  const enableBluetoothAndroid = useCallback(async () => {
    try {
      await BleManager.enableBluetooth();
    } catch (e) {
      throw PERMISSION_ERRORS.BLUETOOTH_OFF;
    }
  }, []);

  const scan = useCallback(async () => {
    if (!canScan) {
      return;
    }
    setDevices([]);
    setPermissionError('');
    setError(false);
    try {
      addDiscoveryListener();
      if (Platform.OS === 'android') {
        await getAndroidPermissions();
        await enableBluetoothAndroid();
      } else if (Platform.OS === 'ios') {
        const version = Platform.Version.split('.')[0];
        if (+version >= 13) {
          await enableBluetoothIOS();
        }
      }
      setScanning(true);
      BleManager.scan([], 15, false);
    } catch (e) {
      if (typeof e === 'string') {
        if (Platform.OS === 'ios') {
          setCanScan(false);
        }
        setPermissionError(e);
      }
      setScanning(false);
      setError(true);
    }
  }, [
    canScan,
    // enableLocation,
    // getAndroidLocationPermission,
    enableBluetoothIOS,
    enableBluetoothAndroid,
    addDiscoveryListener,
    getAndroidPermissions,
  ]);

  const init = async () => {
    await BleManager.start({ showAlert: false, forceLegacy: true });
    scan();
  };

  // listen to bluetooth status
  useEffect(() => {
    const listener = ({ state }) => {
      const isOn = ['on', 'turning_on'].includes(state);
      if (Platform.OS === 'ios') {
        setCanScan(isOn);
      }
      if (isOn) {
        setPermissionError('');
        setError(false);
      } else {
        setPermissionError(PERMISSION_ERRORS.BLUETOOTH_OFF);
        if (scanning) {
          setScanning(false);
        }
        setError(true);
      }
    };
    bleManagerEmitter.addListener(Listener.UPDATE_STATE, listener);
    return () => {
      //bleManagerEmitter.removeListener('BleManagerDidUpdateState', listener);
      bleManagerEmitter.removeAllListeners(Listener.UPDATE_STATE);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    init();
    return () => {
      removeDiscoveryListener();
      BleManager.stopScan();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    canScan,
    scan,
    error,
    permissionError,
    PERMISSION_ERRORS,
    scanning,
    devices,
    openSettings: Linking.openSettings,
  };
};

export default useSearchBlufi;
