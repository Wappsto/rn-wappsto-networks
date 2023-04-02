import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import MenuButton from '../../components/MenuButton';
import NAV from '../../enums/navigation';
import { CapitalizeFirst, useTranslation } from '../../translations';
import DeviceScreen from './DeviceScreen';
import DevicesListScreen from './DevicesListScreen';
import LogScreen from './LogScreen';
import NetworkScreen from './NetworkScreen';

const Stack = createNativeStackNavigator();

export default function MainStackScreen() {
  const { t } = useTranslation();

  return (
    <Stack.Navigator initialRouteName={NAV.MAIN.INDEX}>
      <Stack.Screen
        name={NAV.MAIN.INDEX}
        component={DevicesListScreen}
        options={{
          headerLeft: () => <MenuButton />,
        }}
      />
      <Stack.Screen name={NAV.MAIN.NETWORK} component={NetworkScreen} />
      <Stack.Screen name={NAV.MAIN.DEVICE} component={DeviceScreen} />
      <Stack.Screen
        name={NAV.MAIN.LOGS}
        component={LogScreen}
        options={{
          title: CapitalizeFirst(t('pageTitle.logs')),
        }}
      />
    </Stack.Navigator>
  );
}
