import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import NAV from '../../enums/navigation';
import AccountScreen from './AccountScreen';
import ChangeUsernameScreen from './ChangeUsernameScreen';
import ChangeUserDetailsScreen from './ChangeUserDetailsScreen';
import ChangePasswordScreen from './ChangePasswordScreen';
import RecoverPasswordScreen from './RecoverPasswordScreen';

const Stack = createNativeStackNavigator();

export default function LoginStackScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen name={NAV.ACCOUNT.INDEX} component={AccountScreen} />
      <Stack.Screen name={NAV.ACCOUNT.CHANGE_DETAILS} component={ChangeUserDetailsScreen} />
      <Stack.Screen name={NAV.ACCOUNT.CHANGE_USERNAME} component={ChangeUsernameScreen} />
      <Stack.Screen name={NAV.ACCOUNT.CHANGE_PASSWORD} component={ChangePasswordScreen} />
      <Stack.Screen name={NAV.ACCOUNT.RECOVER_PASSWORD} component={RecoverPasswordScreen} />
    </Stack.Navigator>
  );
}
