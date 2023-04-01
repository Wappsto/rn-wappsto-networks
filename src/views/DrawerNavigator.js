import { createDrawerNavigator } from '@react-navigation/drawer';
import React from 'react';
// import AccountStack from './main/AccountStack';
import MainStack from './main/MainStack';
import NAV from '../enums/navigation';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name={NAV.MAIN.INDEX} component={MainStack} />
      {/* <Drawer.Screen name="Article" component={AccountStack} /> */}
    </Drawer.Navigator>
  );
}
