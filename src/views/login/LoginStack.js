import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import NAV from '../../enums/navigation';
import LoginScreen from './LoginScreen';
import RecoverPasswordScreen from './RecoverPasswordScreen';
import RegisterScreen from './RegisterScreen';
import TermsAndConditionsScreen from './TermsAndConditionsScreen';

const Stack = createNativeStackNavigator();

export default function LoginStackScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={NAV.NOSESSION.LOGIN}
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name={NAV.NOSESSION.LOST_PASSWD} component={RecoverPasswordScreen} />
      <Stack.Screen name={NAV.NOSESSION.REGISTER} component={RegisterScreen} />
      <Stack.Screen name={NAV.NOSESSION.TERMS} component={TermsAndConditionsScreen} />
    </Stack.Navigator>
  );
}
