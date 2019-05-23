import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import Screen from '../../components/Screen';

import RequestError from '../../components/RequestError';
import MenuButton from '../../components/MenuButton';

import { Account, connect } from 'wappsto-components/Account';

class AccountScreen extends Account {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Account',
      headerLeft: <MenuButton navigation={navigation} />
    };
  }

  render() {
    let request = this.props.request;
    let user = this.props.user;
    return (
      <Screen>
        {
          user ?
          <View>
            <Text>UUID: {user.meta.id}</Text>
            <Text>First name: {user.first_name}</Text>
            <Text>Last name: {user.last_name}</Text>
            <Text>Nickname: {user.nickname}</Text>
            <Text>Email: {user.email}</Text>
            <Text>Phone: {user.phone}</Text>
          </View> :
          request && request.status === 'pending' ?
            <Text>loading user data</Text> :
            null
        }
        <RequestError error={request} />
      </Screen>
    );
  }
}

export default connect(AccountScreen);
