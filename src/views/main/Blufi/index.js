import React, { useEffect, useState } from 'react';
import { Platform, PermissionsAndroid, NativeModules, NativeEventEmitter, Button, Text, FlatList, TouchableOpacity } from 'react-native';
import BleManager from 'react-native-ble-manager';
import { BlufiParameter } from './lib/util/params';
import useVisible from 'wappsto-blanket/hooks/useVisible';
import Popup from '../../../components/Popup';
import Configure from './Configure';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const filter = ['ad'];
const Blufi = () => {
  const [ scanning, setScanning ] = useState(false);
  const [ devices, setDevices ] = useState([]);
  const [ selectedDevice, setSelectedDevice ] = useState(null);
  const [ visible, show, hide ] = useVisible(false);

  const selectDevice = (device) => {
    setSelectedDevice(device);
    show();
  }

  const scan = async () => {
    if(!scanning){
      setDevices([]);
      setScanning(true);
      try{
        await BleManager.enableBluetooth();
        BleManager.scan([BlufiParameter.UUID_SERVICE], 2, false);
      } catch(e){
        // SAMI: Handle enable bluetooth error!!!
        setScanning(false);
      }
    }
  }

  const init = () => {
    BleManager.start({showAlert: false});

    if (Platform.OS === 'android' && Platform.Version >= 23) {
        PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
            if (result) {
              scan();
            } else {
              PermissionsAndroid.requestPermission(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
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
      <Popup
        visible={visible}
        hide={hide}
        onRequestClose={hide}
      >
        <Configure device={selectedDevice} hide={hide}/>
      </Popup>
      <Button onPress={scan} title='scan' />
      <FlatList
        onRefresh={scan}
        refreshing={scanning}
        data={devices}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => selectDevice(item)} style={{ marginBottom: 10, backgroundColor: '#EFEFEF', padding: 10}}>
            <Text>{item.name}</Text>
            <Text>{item.id}</Text>
          </TouchableOpacity>
        )}
      />
    </>
  )
}

export default Blufi;
