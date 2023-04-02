import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import MenuButton from '../../components/MenuButton';
import NAV from '../../enums/navigation';
import { CapitalizeFirst, useTranslation } from '../../translations';
import AccountScreen from './AccountScreen';
import ChangePasswordScreen from './ChangePasswordScreen';
import ChangeUserDetailsScreen from './ChangeUserDetailsScreen';
import ChangeUsernameScreen from './ChangeUsernameScreen';

const Stack = createNativeStackNavigator();

export default function LoginStackScreen() {
  const { t } = useTranslation();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name={NAV.ACCOUNT.INDEX}
        component={AccountScreen}
        options={{
          headerLeft: () => <MenuButton />,
          title: CapitalizeFirst(t('pageTitle.account')),
        }}
      />
      <Stack.Screen
        name={NAV.ACCOUNT.CHANGE_DETAILS}
        component={ChangeUserDetailsScreen}
        options={{
          title: CapitalizeFirst(t('account:changeUserDetails')),
        }}
      />
      <Stack.Screen
        name={NAV.ACCOUNT.CHANGE_USERNAME}
        component={ChangeUsernameScreen}
        options={{
          title: CapitalizeFirst(t('account:changeUsername')),
        }}
      />
      <Stack.Screen
        name={NAV.ACCOUNT.CHANGE_PASSWORD}
        component={ChangePasswordScreen}
        options={{
          title: CapitalizeFirst(t('account:changePassword')),
        }}
      />
    </Stack.Navigator>
  );
}
