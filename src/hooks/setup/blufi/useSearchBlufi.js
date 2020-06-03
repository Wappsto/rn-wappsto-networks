import { useEffect, useState, useCallback, useRef } from 'react';
import { Platform, PermissionsAndroid, NativeModules, NativeEventEmitter, DeviceEventEmitter, Linking } from 'react-native';
import BleManager from 'react-native-ble-manager';
import { BlufiParameter } from '../../../BlufiLib/util/params';
import { config } from '../../../configureWappstoRedux';
import LocationServicesDialogBox from 'react-native-android-location-services-dialog-box';
import { useTranslation, CapitalizeFirst } from '../../../translations';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const PermissionError = {
  BLUETOOTH_UNAUTHORIZED: 'bluetoothUnauthorized',
  BLUETOOTH_NOT_SUPPORTED: 'bluetoothNotSupported',
  BLUETOOTH_OFF: 'bluetoothOff',
  BLUETOOTH_GENERIC: 'bluetoothGeneric',
  LOCATION: 'location'
}

const useSearchBlufi = () => {
  const { t } = useTranslation();
  const [ error, setError ] = useState(false);
  const [ permissionError, setPermissionError ] = useState(false);
  const [ scanning, setScanning ] = useState(true);
  const [ devices, setDevices ] = useState([]);
  const [ canScan, setCanScan ] = useState(true);

  const removeDiscoveryListener = useCallback(() => {
    bleManagerEmitter.removeAllListeners('BleManagerDiscoverPeripheral');
    bleManagerEmitter.removeAllListeners('BleManagerStopScan');
  }, []);

  const addDiscoveryListener = useCallback(() => {
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
        removeDiscoveryListener();
        setScanning(false);
      }
    );
  }, [removeDiscoveryListener]);

  const getAndroidLocationPermission = useCallback(async () => {
    if (Platform.Version >= 23) {
      const result = await request(PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION);
      if(result !== RESULTS.GRANTED){
        throw PermissionError.LOCATION;
      }
    }
  }, []);

  const enableLocation = useCallback(async () => {
    try{
      await LocationServicesDialogBox.checkLocationServicesIsEnabled({
        message: CapitalizeFirst(t('onboarding.deviceDiscovery.permissionError.location')),
        ok: CapitalizeFirst(t('onboarding.deviceDiscovery.goToSettings')),
        cancel: CapitalizeFirst(t('genericButton.cancel')),
        enableHighAccuracy: true, // true => GPS AND NETWORK PROVIDER, false => GPS OR NETWORK PROVIDER
        showDialog: true, // false => Opens the Location access page directly
        openLocationServices: true, // false => Directly catch method is called if location services are turned off
        preventOutSideTouch: true, // true => To prevent the location services window from closing when it is clicked outside
        preventBackClick: false, // true => To prevent the location services popup from closing when it is clicked back button
        providerListener: true, // true ==> Trigger locationProviderStatusChange listener when the location state changes
      });
    } catch(e){
      throw PermissionError.LOCATION;
    }
  }, [t]);

  const enableBluetoothIOS = useCallback(async () => {
    let bluetoothState;
    try {
      bluetoothState = await request(PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL);
    } catch (e) {
      throw PermissionError.BLUETOOTH_GENERIC;
    }
    switch (bluetoothState) {
      case RESULTS.UNAVAILABLE:
        throw PermissionError.BLUETOOTH_OFF;
      case RESULTS.DENIED:
      case RESULTS.BLOCKED:
        throw PermissionError.BLUETOOTH_UNAUTHORIZED;
      default:
        break;
    }
  }, []);

  const enableBluetoothAndroid = useCallback(async () => {
    try {
      await BleManager.enableBluetooth();
    } catch (e) {
      throw PermissionError.BLUETOOTH_OFF;
    }
  }, []);

  const scan = useCallback(async () => {
    if(!canScan){
      return;
    }
    setDevices([]);
    setPermissionError();
    setError(false);
    try{
      addDiscoveryListener();
      if(Platform.OS === 'android'){
        await getAndroidLocationPermission();
        await enableLocation();
        await enableBluetoothAndroid();
      } else {
        await enableBluetoothIOS();
      }
      setScanning(true);
      BleManager.scan([BlufiParameter.UUID_SERVICE], 15, false);
    } catch(e){
      if(typeof e === 'string'){
        if(Platform.OS === 'ios'){
          setCanScan(false);
        }
        setPermissionError(e);
      }
      setScanning(false);
      setError(true);
    }
  }, [canScan, enableLocation, getAndroidLocationPermission, enableBluetoothIOS, enableBluetoothAndroid, addDiscoveryListener]);

  const init = async () => {
    await BleManager.start({showAlert: false, forceLegacy: true});
    scan();
  }

  // listen to bluetooth status
  useEffect(() => {
    const listener = ({ state }) => {
      const isOn = ['on', 'turning_on'].includes(state) ? true : false
      if(Platform.OS === 'ios'){
        setCanScan(isOn);
      }
      if(isOn){
        setPermissionError();
        setError(false);
      } else {
        setPermissionError(PermissionError.BLUETOOTH_OFF);
        if(scanning){
          setScanning(false);
        }
        setError(true);
      }
    }
    bleManagerEmitter.addListener('BleManagerDidUpdateState', listener);
    return () => {
      bleManagerEmitter.removeListener('BleManagerDidUpdateState', listener);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    init();
    return () => {
      removeDiscoveryListener();
      BleManager.stopScan();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { canScan, scan, error, permissionError, PermissionError, scanning, devices, openSettings: Linking.openSettings };
}

export default useSearchBlufi;
