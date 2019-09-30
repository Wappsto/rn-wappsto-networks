import AsyncStorage from '@react-native-community/async-storage';
import React, {Component} from 'react';
import {
  View,
  Text,
  TextInput,
  CheckBox,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from 'react-native';

import {config} from '../configureWappstoRedux';

import i18n from '../translations/i18n';

import {withTranslation} from 'react-i18next';

import RequestError from '../components/RequestError';
import Screen from '../components/Screen';

import theme from '../theme/themeExport';
import Icon from 'react-native-vector-icons/FontAwesome5';

import {Login, connect} from 'wappsto-components/Login';

class LoginScreen extends Login {
  constructor(props) {
    super(props);
    this.stream = config.stream;
  }
  saveSession(request) {
    if (this.state.remember_me === true) {
      AsyncStorage.setItem('session', JSON.stringify(request.json));
    }
  }
  navigateToMain(request) {
    this.props.navigation.navigate('MainScreen');
  }
  render() {
    const postRequest = this.props.postRequest;
    const verifyRequest = this.props.verifyRequest;
    let request = postRequest || verifyRequest;
    return (
      <Screen style={theme.common.centeredContent}>
        <LoginScreen.Header />
        <View
          style={{
            flex: 1,
            justifyContent: 'space-between',
          }}>
          <View style={theme.common.formElements}>
            <Text style={theme.common.label}>Email</Text>
            <TextInput
              style={theme.common.input}
              onChangeText={username => this.setState({username})}
              value={this.state.username}
              textContentType="emailAddress"
            />
            <Text style={theme.common.label}>Password</Text>
            <View>
              <TextInput
                style={theme.common.input}
                onChangeText={password => this.setState({password})}
                value={this.state.password}
                textContentType="password"
                secureTextEntry={!this.state.showPassword}
              />
              <Icon
                style={theme.common.passwordVisibilityButton}
                name={this.state.showPassword ? 'eye' : 'eye-slash'}
                onPress={this.toggleShowPassword}
                size={14}
              />
            </View>
            <TouchableOpacity
              style={[
                theme.common.button,
                this.state.isSigninInProgress ||
                (request && request.status === 'pending')
                  ? theme.common.disabled
                  : null,
              ]}
              onPress={this.signIn}>
              <Text style={theme.common.btnText}>Log in</Text>
            </TouchableOpacity>
          </View>
          <LoginScreen.Footer />
        </View>
        <Modal
          animationType="none"
          transparent={true}
          visible={request && request.status === 'pending' ? true : false}>
          <View style={theme.common.modalBackground}>
            <ActivityIndicator size="large" color={theme.variables.white} />
          </View>
        </Modal>
        <RequestError error={postRequest} />
      </Screen>
    );
  }
}

LoginScreen.Header = () => (
  <View style={theme.common.header}>
    <Text>Wappsto</Text>
  </View>
);

LoginScreen.Footer = () => (
  <View style={theme.common.footer}>
    <Text>Powered by Seluxit</Text>
  </View>
);

export function setHeader(comp){
  LoginScreen.Header = comp;
}

export function setFooter(comp){
  LoginScreen.Footer = comp;
}

export default connect(LoginScreen);
