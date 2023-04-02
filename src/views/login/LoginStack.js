import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import NAV from '../../enums/navigation';
import { CapitalizeFirst, useTranslation } from '../../translations';
import LoginScreen from './LoginScreen';
import RecoverPasswordScreen from './RecoverPasswordScreen';
import RegisterScreen from './RegisterScreen';
import TermsAndConditionsScreen from './TermsAndConditionsScreen';

const Stack = createNativeStackNavigator();

export default function LoginStackScreen() {
  const { t } = useTranslation();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name={NAV.NOSESSION.LOGIN}
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={NAV.NOSESSION.LOST_PASSWD}
        component={RecoverPasswordScreen}
        options={{
          title: CapitalizeFirst(t('account:forgotPassword')),
        }}
      />
      <Stack.Screen
        name={NAV.NOSESSION.REGISTER}
        component={RegisterScreen}
        options={{
          title: CapitalizeFirst(t('account:register')),
        }}
      />
      <Stack.Screen
        name={NAV.NOSESSION.TERMS}
        component={TermsAndConditionsScreen}
        options={{
          title: CapitalizeFirst(t('pageTitle.Terms')),
        }}
      />
    </Stack.Navigator>
  );
}
