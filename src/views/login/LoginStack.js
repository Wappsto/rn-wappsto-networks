import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import NAV from '../../enums/navigation';
import { CapitalizeFirst, useTranslation } from '../../translations';
import { screenComponents } from '../screenComponents';

const Stack = createNativeStackNavigator();

export default function LoginStackScreen() {
  const { t } = useTranslation();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name={NAV.NOSESSION.LOGIN}
        component={screenComponents.LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={NAV.NOSESSION.LOST_PASSWD}
        component={screenComponents.RecoverPasswordScreen}
        options={{
          title: CapitalizeFirst(t('account:forgotPassword')),
        }}
      />
      <Stack.Screen
        name={NAV.NOSESSION.REGISTER}
        component={screenComponents.RegisterScreen}
        options={{
          title: CapitalizeFirst(t('account:register')),
        }}
      />
      <Stack.Screen
        name={NAV.NOSESSION.TERMS}
        component={screenComponents.TermsAndConditionsScreen}
        options={{
          title: CapitalizeFirst(t('pageTitle.terms')),
        }}
      />
      <Stack.Screen
        name={NAV.NOSESSION.PRIVACY}
        component={screenComponents.PrivacyScreen}
        options={{
          title: CapitalizeFirst(t('pageTitle.privacy')),
        }}
      />
    </Stack.Navigator>
  );
}
