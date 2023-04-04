import { createDrawerNavigator } from '@react-navigation/drawer';
import React from 'react';
import AccountStack from './account/AccountStack';
import MainStack from './main/MainStack';
import DrawerMenu from '../components/DrawerMenu';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <>
      <Drawer.Navigator drawerContent={props => <DrawerMenu {...props} />}>
        <Drawer.Screen name="main" component={MainStack} options={{ headerShown: false }} />
        <Drawer.Screen name="account" component={AccountStack} options={{ headerShown: false }} />
      </Drawer.Navigator>
    </>
  );
}

DrawerNavigator.displayName = 'DrawerNavigator';
