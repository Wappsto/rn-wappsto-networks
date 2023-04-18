import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import MenuButton from '../../components/MenuButton';
import NAV from '../../enums/navigation';
import { CapitalizeFirst, useTranslation } from '../../translations';
import { screenComponents } from '../screenComponents';

const Stack = createNativeStackNavigator();

export default function LoginStackScreen() {
  const { t } = useTranslation();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name={NAV.ACCOUNT.INDEX}
        component={screenComponents.AccountScreen}
        options={{
          headerLeft: () => <MenuButton />,
          title: CapitalizeFirst(t('pageTitle.account')),
        }}
      />
      <Stack.Screen
        name={NAV.ACCOUNT.CHANGE_DETAILS}
        component={screenComponents.ChangeUserDetailsScreen}
        options={{
          title: CapitalizeFirst(t('account:changeUserDetails')),
        }}
      />
      <Stack.Screen
        name={NAV.ACCOUNT.CHANGE_USERNAME}
        component={screenComponents.ChangeUsernameScreen}
        options={{
          title: CapitalizeFirst(t('account:changeUsername')),
        }}
      />
      <Stack.Screen
        name={NAV.ACCOUNT.CHANGE_PASSWORD}
        component={screenComponents.ChangePasswordScreen}
        options={{
          title: CapitalizeFirst(t('account:changePassword')),
        }}
      />
    </Stack.Navigator>
  );
}
