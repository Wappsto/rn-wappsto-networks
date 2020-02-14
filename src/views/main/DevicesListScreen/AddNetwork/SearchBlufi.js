import React, { useEffect, useState, useCallback } from 'react';
import { Platform, PermissionsAndroid, NativeModules, NativeEventEmitter, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import BleManager from 'react-native-ble-manager';
import { BlufiParameter } from '@/BlufiLib/util/params';
import i18n, { CapitalizeFirst } from '@/translations';
import theme from '@/theme/themeExport';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const filter = ['ad'];
const Blufi = ({ next, previous, hide, setSelectedDevice }) => {
  const [ error, setError ] = useState(false);
  const [ scanning, setScanning ] = useState(true);
  const [ devices, setDevices ] = useState([]);

  const handleDevicePress = useCallback((item) => {
    setSelectedDevice(item);
    next();
  }, [next, setSelectedDevice]);

  const scan = async () => {
    setDevices([]);
    setScanning(true);
    try{
      await BleManager.enableBluetooth();
      BleManager.scan([BlufiParameter.UUID_SERVICE], 5, false);
    } catch(e){
      // SAMI: Handle enable bluetooth error!!!
      setScanning(false);
      setError(true);
    }
  }

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
                  // SAMI: Handle reqject location permission, this is required by BLE!!!
                  console.log('User refuse');
                }
              });
            }
      });
    }
  }

  const addDiscoveryListener = () => {
    // Get discovered peripherals
    bleManagerEmitter.addListener(
      'BleManagerDiscoverPeripheral',
      (device) => {
        const lowerName = device.name ? device.name.toLowerCase() : '';
        setDevices(devices => {
          if(!filter || filter.length === 0 || (filter.find(f => lowerName.includes(f.toLowerCase())) && !devices.find(d => d.id === device.id))){
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

  useEffect(() => {
    init();
    addDiscoveryListener();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Text style={theme.common.H3}>{CapitalizeFirst(i18n.t(devices.length === 0 ? 'blufi.lookingForDevices' : 'blufi.foundDevices'))}</Text>
      {scanning && <ActivityIndicator size='large'/>}
      {!scanning &&
        <TouchableOpacity onPress={scan} style={{ marginBottom: 10, backgroundColor: '#EFEFEF', padding: 10}}>
          <Text>{CapitalizeFirst(i18n.t('blufi.scanAgain'))}</Text>
        </TouchableOpacity>
      }
      <FlatList
        data={devices}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleDevicePress(item)} style={theme.common.button}>
            <Text>{item.name}</Text>
            <Text>{item.id}</Text>
          </TouchableOpacity>
        )}
      />
      {error && <Text>{CapitalizeFirst(i18n.t('blufi.scanError'))}</Text>}
    </>
  )
}

export default Blufi;
