import React, { useEffect, useState, useRef } from 'react';
import { Platform, PermissionsAndroid, NativeModules, NativeEventEmitter, Button, Text, Flatlist } from 'react-native';
import BleManager from 'react-native-ble-manager';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const filter = [];
const Blufi = () => {
  const [ scanning, setScanning ] = useState(false);
  const [ devices, setDevices ] = useState([]);

  const scan = async () => {
    if(!scanning){
      setDevices([]);
      setScanning(true);
      try{
        await BleManager.enableBluetooth();
        BleManager.start({showAlert: false});
      } catch(e){
        setScanning(false);
      }
    }
  }

  const init = () => {
    if (Platform.OS === 'android' && Platform.Version >= 23) {
        PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
            if (result) {
              scan();
            } else {
              PermissionsAndroid.requestPermission(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
                if (result) {
                  scan();
                } else {
                  // SAMI: Handle reqject location permission, this is required by BLE
                  console.log('User refuse');
                }
              });
            }
      });
    }
  }

  useEffect(() => {
    init();
    bleManagerEmitter.addListener(
      'BleManagerDiscoverPeripheral',
      (args) => {
          // The id: args.id
          // The name: args.name
          console.log(args);
      }
    );
  }, []);

  return (
    <>
      <Button onPress={scan} title='scan' />
      <Flatlist
        onRefresh={scan}
        refreshing={scanning}
        data={devices}
        renderItem={({ item }) => (
          <>
            <Text>item.name</Text>
            <Text>item.id</Text>
          </>
        )}
      />
    </>
  )
}

export default Blufi;
