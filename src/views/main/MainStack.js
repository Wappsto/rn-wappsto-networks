import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import MenuButton from '../../components/MenuButton';
import NAV from '../../enums/navigation';
import { CapitalizeFirst, useTranslation } from '../../translations';
import { screenComponents } from '../screenComponents';

const Stack = createNativeStackNavigator();

export default function MainStackScreen() {
  const { t } = useTranslation();

  return (
    <Stack.Navigator initialRouteName={NAV.MAIN.INDEX}>
      <Stack.Screen
        name={NAV.MAIN.INDEX}
        component={screenComponents.DevicesListScreen}
        options={{
          headerLeft: () => <MenuButton />,
        }}
      />
      <Stack.Screen name={NAV.MAIN.NETWORK} component={screenComponents.NetworkScreen} />
      <Stack.Screen name={NAV.MAIN.DEVICE} component={screenComponents.DeviceScreen} />
      <Stack.Screen
        name={NAV.MAIN.LOGS}
        component={screenComponents.LogScreen}
        options={{
          title: CapitalizeFirst(t('pageTitle.logs')),
        }}
      />
    </Stack.Navigator>
  );
}
