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
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-community/google-signin';
import firebase from 'react-native-firebase';
import config from '../config';

import {startStream, getStreams} from '../utils';

import i18n, {CapitalizeFirst} from '../translations/i18n';

import RequestError from '../components/RequestError';

import theme from '../theme/themeExport';
import Icon from 'react-native-vector-icons/FontAwesome5';

import {Login, connect} from '../wappsto-components/Login';

function mapStateToProps(state, componentProps) {
  return {
    currentStreams: getStreams(state),
  };
}

class LoginScreen extends Login {
  constructor(props) {
    super(props);
    this.state.isSigninInProgress = false;
    this.passwordInputRef = React.createRef();
    this.signIn = this.signIn.bind(this);
    this.googleSignIn = this.googleSignIn.bind(this);
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
  signIn() {
    this.fbSignInError = null;
    super.signIn();
  }
  async googleSignIn() {
    this.fbSignInError = null;
    try {
      this.setState({isSigninInProgress: true});
      await GoogleSignin.configure({
        webClientId: config.firebaseWebClientId,
      });
      const data = await GoogleSignin.signIn();
      GoogleSignin.signOut();
      const credential = firebase.auth.GoogleAuthProvider.credential(
        data.idToken,
        data.accessToken,
      );
      const firebaseUserCredential = await firebase
        .auth()
        .signInWithCredential(credential);
      const token = await firebaseUserCredential.user.getIdToken();
      this.props.makeRequest('POST', '/session', {
        firebase_token: token,
        remember_me: this.state.remember_me,
      });
    } catch (error) {
      let code;
      if (error.code !== statusCodes.SIGN_IN_CANCELLED) {
        if (error.code === statusCodes.IN_PROGRESS) {
          // operation (f.e. sign in) is in progress already
          code = 'fbsi_in_progress';
        } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
          // play services not available or outdated
          code = 'fbsi_psna';
        } else {
          // some other error happened
          code = 'generic';
        }
        this.fbSignInError = {
          status: 'error',
          json: {
            code,
          },
        };
      }
    }
    this.setState({isSigninInProgress: false});
  }
  startStream(session) {
    const {initializeStream, currentStreams} = this.props;
    startStream(currentStreams, session, initializeStream);
  }
  render() {
    const postRequest = this.props.postRequest || this.fbSignInError;
    const verifyRequest = this.props.verifyRequest;
    const loading = postRequest && postRequest.status === 'pending';
    return (
      <SafeAreaView style={{flex: 1}}>
        <StatusBar
          backgroundColor={theme.variables.white}
          barStyle="dark-content"
        />
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
            <GoogleSigninButton
              style={theme.common.gSignInButton}
              size={
                theme.variables.googleSigninButtonSize ||
                GoogleSigninButton.Size.Wide
              }
              color={
                theme.variables.googleSigninButtonColor ||
                GoogleSigninButton.Color.Dark
              }
              onPress={this.googleSignIn}
              disabled={this.state.isSigninInProgress || loading}
            />
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
      </SafeAreaView>
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

export default connect(
  LoginScreen,
  mapStateToProps,
);
