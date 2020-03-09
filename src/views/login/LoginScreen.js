import React, { useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StatusBar, ScrollView } from 'react-native';
import { GoogleSigninButton } from '@react-native-community/google-signin';
import Screen from '../../components/Screen';
import { useTranslation, CapitalizeFirst } from '../../translations';

import useSignIn from '../../hooks/useSignIn';
import RequestError from '../../components/RequestError';

import theme from '../../theme/themeExport';
import Icon from 'react-native-vector-icons/FontAwesome5';

const LoginScreen = React.memo(({ navigation }) => {
  const { t } = useTranslation();
  const {
    username,
    password,
    moveToPasswordField,
    handleTextChange,
    passwordInputRef,
    showPassword,
    toggleShowPassword,
    checkAndSignIn,
    canSignIn,
    signIn,
    canTPSignIn,
    googleSignIn,
    postRequest,
    loading
  } = useSignIn(navigation);

  const moveToTACScreen = useCallback(() => {
    navigation.navigate('TermsAndConditionsScreen');
  }, [navigation]);

  return (
    <Screen>
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
          <TouchableOpacity
            disabled={loading}
            style={[
              theme.common.button,
              loading
                ? theme.common.disabled
                : null,
            ]}
            onPress={moveToTACScreen}>
            <Text style={theme.common.btnText}>
              {CapitalizeFirst(t('register'))}
            </Text>
          </TouchableOpacity>
          <GoogleSigninButton
            style={theme.common.GoogleSigninButtonStyle}
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Light}
            onPress={googleSignIn}
            disabled={!canTPSignIn}
          />
        </View>
        <LoginScreen.Footer />
      </ScrollView>
    </Screen>
  );
});

LoginScreen.navigationOptions = ({ screenProps: { t } }) => {
  return {
    headerShown: false
  };
};

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
