import { useEffect, useState, useCallback } from 'react';
import { Platform, PermissionsAndroid, NativeModules, NativeEventEmitter } from 'react-native';
import BleManager from 'react-native-ble-manager';
import { BlufiParameter } from '../BlufiLib/util/params';
import { config } from '../configureWappstoRedux';
import LocationServicesDialogBox from 'react-native-android-location-services-dialog-box';
import { useTranslation, CapitalizeFirst } from '../translations';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const PermissionError = {
  BLUETOOTH: 'bluetooth',
  LOCATION: 'location'
}

const useSearchBlufi = () => {
  const { t } = useTranslation();
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
            devices = [...devices, device];
            return devices.sort((a, b) => b.rssi - a.rssi);
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

  const getAndroidLocationPermission = useCallback(async () => {
    if (Platform.Version >= 23) {
      try{
        await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION);
      } catch(e){
        try{
          await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION);
        } catch(err){
          throw PermissionError.LOCATION;
        }
      }
    }
  }, []);

  const enableLocation = useCallback(async () => {
    try{
      await LocationServicesDialogBox.checkLocationServicesIsEnabled({
        message: CapitalizeFirst(t('onboarding.deviceDiscovery.locationPermissionMessage')),
        ok: CapitalizeFirst(t('yes')),
        cancel: CapitalizeFirst(t('no')),
        enableHighAccuracy: true, // true => GPS AND NETWORK PROVIDER, false => GPS OR NETWORK PROVIDER
        showDialog: true, // false => Opens the Location access page directly
        openLocationServices: true, // false => Directly catch method is called if location services are turned off
        preventOutSideTouch: false, // true => To prevent the location services window from closing when it is clicked outside
        preventBackClick: false, // true => To prevent the location services popup from closing when it is clicked back button
        providerListener: false, // true ==> Trigger locationProviderStatusChange listener when the location state changes
      });
    } catch(e){
      throw PermissionError.LOCATION;
    }
  }, [t]);

  const enableBluetooth = useCallback(async () => {
    try {
      await BleManager.enableBluetooth();
    } catch (e) {
      throw PermissionError.BLUETOOTH;
    }
  }, []);

  const scan = useCallback(async () => {
    setDevices([]);
    setScanning(true);
    setPermissionError();
    setError(false);
    try{
      addDiscoveryListener();
      if(Platform.OS === 'android'){
        await getAndroidLocationPermission();
        await enableLocation();
        await enableBluetooth();
      }
      BleManager.scan([BlufiParameter.UUID_SERVICE], 15, false);
    } catch(e){
      if(typeof e === 'string'){
        setPermissionError(e);
      }
      setScanning(false);
      setError(true);
    }
  }, [enableLocation, getAndroidLocationPermission, enableBluetooth]);

  const init = () => {
    BleManager.start({showAlert: false, forceLegacy: true});
    scan();
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
