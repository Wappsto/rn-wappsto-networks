import { createDrawerNavigator } from 'react-navigation';
import { replaceComponent } from '../src/override/components';
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
      Home: { screen: this.MainStackScreen },
      Account: { screen: this.AccountStackScreen },
      NewPage: { screen: NewPage}
    }, {
      contentComponent: this.DrawerMenu
    });
  });

  // or simply

  components.MainScreen = () => {
    return createDrawerNavigator({
      Home: { screen: this.MainStackScreen },
      Account: { screen: this.AccountStackScreen },
      NewPage: { screen: NewPage}
    }, {
      contentComponent: this.DrawerMenu
    });
  };
  return components;
});
