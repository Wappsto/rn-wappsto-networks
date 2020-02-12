import React, { useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StatusBar, ScrollView } from 'react-native';
import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-community/google-signin';
import firebase from 'react-native-firebase';
import { useDispatch } from 'react-redux';
import config from 'wappsto-redux/config';
import { removeRequest } from 'wappsto-redux/actions/request';
import useRequest from 'wappsto-blanket/hooks/useRequest';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation, CapitalizeFirst } from '../translations';

import RequestError from '@/components/RequestError';

import theme from '@/theme/themeExport';
import Icon from 'react-native-vector-icons/FontAwesome5';

const isEmail = (str) => {
  return str.match(/\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/);
}

const LoginScreen = React.memo(({ navigation }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [ username, setUsername ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ isSigninInProgress, setIsSigninInProgress ] = useState(false);
  const [ showPassword, setShowPassword ] = useState(false);
  const passwordInputRef = useRef();
  const fbSignInError = useRef(null);
  const { request, send } = useRequest();

  const toggleShowPassword = () => {
    setShowPassword(sp => !sp);
  }

  const saveSession = (cRequest) => {
    AsyncStorage.setItem('session', JSON.stringify(cRequest.json));
  }

  const navigateToMain = () => {
    navigation.navigate('MainScreen');
  }

  const moveToPasswordField = () => {
    const trimText = username.trim();
    if (trimText !== username) {
      setUsername(trimText);
    }
    passwordInputRef.current.focus();
  }

  const handleTextChange = (text, type) => {
    let currentText;
    let set;
    if(type === 'username'){
      currentText = username;
      set = setUsername;
    } else {
      currentText = password;
      set = setPassword;
    }
    if (text.length - currentText.length === 1) {
      set(text);
    } else {
      set(text.trim());
    }
  }

  const signIn = () => {
    fbSignInError.current = null;
    send({
      method: 'POST',
      url: '/session',
      body: {
        username: username,
        password: password,
        remember_me: true
      }
    });
  }

  const checkAndSignIn = () => {
    if (isEmail(username) && password) {
      signIn();
    }
  }

  const googleSignIn = async() => {
    fbSignInError.current = {
      id: 'fbSignInError',
      status: 'pending'
    };
    try {
      setIsSigninInProgress(true);
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
      fbSignInError.current = null;
      send({
        method: 'POST',
        url: '/session',
        body: {
          firebase_token: token,
          remember_me: true
        }
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
        fbSignInError.current = {
          id: 'fbSignInError',
          status: 'error',
          json: {
            code,
          },
        };
      }
    }
    setIsSigninInProgress(false);
  }

  const userLogged = (cRequest) => {
    dispatch(removeRequest(cRequest.id));
    saveSession(cRequest);
    navigateToMain();
  }

  useEffect(() => {
    if(request && request.status === 'success'){
      userLogged(request);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [request]);

  const postRequest = fbSignInError.current || request;
  const loading = postRequest && (postRequest.status === 'pending' || postRequest.status === 'success');
  const canSignIn = !isSigninInProgress && !loading && isEmail(username) && password;
  return (
    <SafeAreaView>
      <ScrollView>
        <StatusBar
          backgroundColor={theme.variables.white}
          barStyle='dark-content'
        />
        <LoginScreen.Header />
        <View style={theme.common.formElements}>
          <Text style={theme.common.label}>
            {CapitalizeFirst(t('email'))}
          </Text>
          <TextInput
            style={theme.common.input}
            onChangeText={usernameText =>
              handleTextChange(usernameText, 'username')
            }
            value={username}
            textContentType='emailAddress'
            autoCapitalize='none'
            onSubmitEditing={moveToPasswordField}
            keyboardType='email-address'
            returnKeyType='next'
            disabled={loading}
          />
          <Text style={theme.common.label}>
            {CapitalizeFirst(t('password'))}
          </Text>
          <View>
            <TextInput
              ref={passwordInputRef}
              style={theme.common.input}
              onChangeText={passwordText =>
                handleTextChange(passwordText, 'password')
              }
              value={password}
              textContentType='password'
              secureTextEntry={!showPassword}
              autoCapitalize='none'
              returnKeyType='done'
              onSubmitEditing={checkAndSignIn}
              disabled={loading}
            />
            <Icon
              style={theme.common.passwordVisibilityButton}
              name={showPassword ? 'eye-slash' : 'eye'}
              onPress={toggleShowPassword}
              size={14}
            />
          </View>
          {loading && (
            <ActivityIndicator size='large' color={theme.variables.primary} />
          )}
          <RequestError request={postRequest} />
          <TouchableOpacity
            disabled={!canSignIn}
            style={[
              theme.common.button,
              !canSignIn
                ? theme.common.disabled
                : null,
            ]}
            onPress={signIn}>
            <Text style={theme.common.btnText}>
              {CapitalizeFirst(t('signIn'))}
            </Text>
          </TouchableOpacity>
          <GoogleSigninButton
            style={theme.common.GoogleSigninButtonStyle}
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Light}
            onPress={googleSignIn}
            disabled={isSigninInProgress || loading}
          />
        </View>
        <LoginScreen.Footer />
      </ScrollView>
    </SafeAreaView>
  );
});

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

export default LoginScreen;
