import AsyncStorage from '@react-native-community/async-storage';
import React, {Component} from 'react';
import {View, StyleSheet, StatusBar} from 'react-native';
import SessionVerifier from './SessionVerifier';

import theme from '../theme/themeExport';
import Icon from 'react-native-vector-icons/FontAwesome5';

export default class SplashScreen extends Component {
  state = {
    status: 'pending',
    session: null,
  };
  async getSession() {
    try {
      let session = await AsyncStorage.getItem('session');
      if (session !== null) {
        session = JSON.parse(session);
        this.setState({session, status: 'success'});
      } else {
        this.setState({status: 'error'});
      }
    } catch (e) {
      this.setState({status: 'error'});
    }
  }
  componentDidMount() {
    this.getSession();
  }
  render() {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor={theme.variables.white} barStyle="dark-content" />
        <Icon name="kiwi-bird" size={100} color={theme.variables.primary} />
        <SessionVerifier
          status={this.state.status}
          session={this.state.session}
          navigate={this.props.navigation.navigate}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: theme.variables.modalBgColor,
  },
});
