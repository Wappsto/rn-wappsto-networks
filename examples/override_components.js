import { createDrawerNavigator } from 'react-navigation';
import { replaceComponent } from '../src/override';
import theme from '../src/theme/themeExport';

// overriding COMPONENTS
import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

class NewPage extends Component {
  render() {
    return (
      <View>
        <Text styles={theme.common.text}>I'm the MyComponent component</Text>
      </View>
    );
  }
}

replaceComponent((components) => {
  components.replace("MainScreen", () => {
    return createDrawerNavigator({
      Networks: { screen: components.MainStackScreen },
      Account: { screen: components.AccountStackScreen },
      NewPage: { screen: NewPage}
    }, {
      contentComponent: components.DrawerMenu
    });
  });

  // or simply

  components.MainScreen = () => {
    return createDrawerNavigator({
      Networks: { screen: components.MainStackScreen },
      Account: { screen: components.AccountStackScreen },
      NewPage: { screen: NewPage}
    }, {
      contentComponent: components.DrawerMenu
    });
  };
  return components;
});
