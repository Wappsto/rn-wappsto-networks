import AsyncStorage from '@react-native-community/async-storage';
import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  StatusBar,
  ScrollView,
} from 'react-native';

import {startStream} from '../utils';

import i18n, {CapitalizeFirst} from '../translations/i18n';

import RequestError from '../components/RequestError';
import Screen from '../components/Screen';

import theme from '../theme/themeExport';
import Icon from 'react-native-vector-icons/FontAwesome5';

import {Login, connect} from '../wappsto-components/Login';

class LoginScreen extends Login {
  constructor(props) {
    super(props);
    this.passwordInputRef = React.createRef();
  }
  componentDidMount() {}
  saveSession(request) {
    if (this.state.remember_me === true) {
      AsyncStorage.setItem('session', JSON.stringify(request.json));
    }
  }
  navigateToMain(request) {
    this.props.navigation.navigate('MainScreen');
  }
  moveToPasswordField = () => {
    const trimText = this.state.username.trim();
    if (trimText !== this.state.username) {
      this.setState({username: trimText});
    }
    this.passwordInputRef.current.focus();
  };
  handleTextChange = (text, type) => {
    if (text.length - this.state[type].length === 1) {
      this.setState({[type]: text});
    } else {
      this.setState({[type]: text.trim()});
    }
  };
  checkAndSignIn = () => {
    if (this.state.username && this.state.password) {
      this.signIn();
    }
  };
  startStream(session) {
    startStream(session, this.props.initializeStream);
  }
  render() {
    const postRequest = this.props.postRequest;
    const verifyRequest = this.props.verifyRequest;
    const loading = postRequest && postRequest.status === 'pending';
    return (
      <Screen style={theme.common.centeredContent}>
        <StatusBar backgroundColor={theme.variables.white} barStyle="dark-content" />
        <ScrollView>
          <LoginScreen.Header />
          <View style={theme.common.formElements}>
            <Text style={theme.common.label}>
              {CapitalizeFirst(i18n.t('email'))}
            </Text>
            <TextInput
              style={theme.common.input}
              onChangeText={username =>
                this.handleTextChange(username, 'username')
              }
              value={this.state.username}
              textContentType="emailAddress"
              autoCapitalize="none"
              onSubmitEditing={this.moveToPasswordField}
              keyboardType="email-address"
              returnKeyType="next"
              disabled={loading}
            />
            <Text style={theme.common.label}>
              {CapitalizeFirst(i18n.t('password'))}
            </Text>
            <View>
              <TextInput
                ref={this.passwordInputRef}
                style={theme.common.input}
                onChangeText={password =>
                  this.handleTextChange(password, 'password')
                }
                value={this.state.password}
                textContentType="password"
                secureTextEntry={!this.state.showPassword}
                autoCapitalize="none"
                onSubmitEditing={this.checkAndSignIn}
                disabled={loading}
              />
              <Icon
                style={theme.common.passwordVisibilityButton}
                name={this.state.showPassword ? 'eye-slash' : 'eye'}
                onPress={this.toggleShowPassword}
                size={14}
              />
            </View>
            {loading && (
              <ActivityIndicator size="large" color={theme.variables.primary} />
            )}
            <RequestError error={postRequest} />
            <TouchableOpacity
              style={[
                theme.common.button,
                this.state.isSigninInProgress || loading
                  ? theme.common.disabled
                  : null,
              ]}
              onPress={this.signIn}>
              <Text style={theme.common.btnText}>
                {CapitalizeFirst(i18n.t('signIn'))}
              </Text>
            </TouchableOpacity>
          </View>
          <LoginScreen.Footer />
        </ScrollView>
        <Modal
          animationType="none"
          transparent={true}
          visible={
            verifyRequest && verifyRequest.status === 'pending' ? true : false
          }>
          <View style={theme.common.modalBackground}>
            <ActivityIndicator size="large" color={theme.variables.primary} />
          </View>
        </Modal>
      </Screen>
    );
  }
}

LoginScreen.Header = () => (
  <View style={theme.common.header}>
    <Text style={{fontSize: 30, textAlign: 'center'}}>
      Welcome to Wappsto Networks
    </Text>
  </View>
);

LoginScreen.Footer = () => (
  <View style={theme.common.footer}>
    <Text>Powered by Seluxit</Text>
  </View>
);

export function setHeader(comp) {
  LoginScreen.Header = comp;
}

export function setFooter(comp) {
  LoginScreen.Footer = comp;
}

export default connect(LoginScreen);
