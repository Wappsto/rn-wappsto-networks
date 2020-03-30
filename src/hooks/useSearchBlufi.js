import { useEffect, useState, useCallback } from 'react';
import { Platform, PermissionsAndroid, NativeModules, NativeEventEmitter } from 'react-native';
import BleManager from 'react-native-ble-manager';
import { BlufiParameter } from '../BlufiLib/util/params';
import { config } from '../configureWappstoRedux';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const useSearchBlufi = () => {
  const [ error, setError ] = useState(false);
  const [ permissionError, setPermissionError ] = useState(false);
  const [ scanning, setScanning ] = useState(true);
  const [ devices, setDevices ] = useState([]);

  const removeDiscoveryListener = () => {
    bleManagerEmitter.removeAllListeners('BleManagerDiscoverPeripheral');
    bleManagerEmitter.removeAllListeners('BleManagerStopScan');
  }

  const addDiscoveryListener = () => {
    // Get discovered peripherals
    bleManagerEmitter.addListener(
      'BleManagerDiscoverPeripheral',
      (device) => {
        const lowerName = device.name ? device.name.toLowerCase() : '';
        setDevices(devices => {
          if((!config.blufiFilter || config.blufiFilter.length === 0 || config.blufiFilter.find(f => lowerName.includes(f.toLowerCase()))) && !devices.find(d => d.id === device.id)){
            return [...devices, device];
          }
          return devices;
        });
      }
    );

    // Scan stopped
    bleManagerEmitter.addListener(
      'BleManagerStopScan',
      () => {
        setScanning(false);
      }
    );
  }

  const scan = useCallback(async () => {
    setDevices([]);
    setScanning(true);
    try{
      addDiscoveryListener();
      await BleManager.enableBluetooth();
      BleManager.scan([BlufiParameter.UUID_SERVICE], 15, false);
    } catch(e){
      setScanning(false);
      setError(true);
    }
  }, []);

  const init = () => {
    BleManager.start({showAlert: false});

    if (Platform.OS === 'android' && Platform.Version >= 23) {
        PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
            if (result) {
              scan();
            } else {
              PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
                if (result) {
                  scan();
                } else {
                  setPermissionError(true);
                }
              });
            }
      });
    }
  }

  useEffect(() => {
    init();
    return () => {
      removeDiscoveryListener();
      BleManager.stopScan();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { scan, error, permissionError, scanning, devices };
}

export default useSearchBlufi;
