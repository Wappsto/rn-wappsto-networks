import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import NAV from '../../enums/navigation';
import DevicesListScreen from './DevicesListScreen';
// import DeviceScreen from './DeviceScreen';
// import NetworkScreen from './NetworkScreen';
// import LogScreen from './LogScreen';

const Stack = createNativeStackNavigator();

export default function LoginStackScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen name={NAV.MAIN.INDEX} component={DevicesListScreen} />
      {/* <Stack.Screen name={NAV.MAIN.NETWORK} component={NetworkScreen} />
      <Stack.Screen name={NAV.MAIN.DEVICE} component={DeviceScreen} />
      <Stack.Screen name={NAV.MAIN.LOGS} component={LogScreen} /> */}
    </Stack.Navigator>
  );
}
