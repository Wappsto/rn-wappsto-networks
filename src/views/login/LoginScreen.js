import React, { useCallback } from 'react';
import { Image, View, Text, Linking, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, StatusBar, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GoogleSigninButton } from '@react-native-community/google-signin';
import { useTranslation, CapitalizeFirst } from '../../translations';
import useSignIn from '../../hooks/useSignIn';
import RequestError from '../../components/RequestError';
import ReCaptcha from '../../components/ReCaptcha';
import theme from '../../theme/themeExport';
import Icon from 'react-native-vector-icons/FontAwesome5';
import image from '../../theme/images';

const OpenURLButton = ({ url, children }) => {
  const handlePress = useCallback(async () => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    }
  }, [url]);

  return (
    <TouchableOpacity onPress={handlePress}>
      <Text style={[theme.common.linkBtn, {textAlign: 'center', color: theme.variables.primary}]}>{children}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  signinButton: {
    width:'100%',
    maxWidth: 260,
    height: 48,
    marginVertical :8,
    borderRadius: 3,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  signinButtonText: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
    color: 'white'
  },
  GoogleSigninButtonWrapper: {
    backgroundColor: 'white',
    borderRadius: 2,
    marginLeft: 1.5,
    marginRight:12
  },
  FacebookSigninButtonWrapper: {
    marginLeft: 8
  },
  signinButtonImage: {
    width:25,
    height:25,
    margin:10
  },
  appTitle:{
    fontSize:30,
    padding: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    color:theme.variables.primary
  }
});

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
    facebookSignIn,
    postRequest,
    showRecaptcha,
    onCheckRecaptcha,
    recaptchaExtraData,
    loading
  } = useSignIn(navigation);

  const moveToTACScreen = useCallback(() => {
      navigation.navigate(LoginScreen.registerNavigateTo);
    }, [navigation]);

  return (
    <SafeAreaView style={theme.common.container}>
      <StatusBar backgroundColor={theme.variables.appBgColor} barStyle='dark-content' />
      <ScrollView>
        <LoginScreen.Header />
        <View style={theme.common.contentContainer}>
          <Text style={[theme.common.p, {textAlign: 'center'}]}>
            {CapitalizeFirst(t('loginAndRegistration.loginWithEmail'))}
          </Text>
          <View style={theme.common.card}>
            <Text style={theme.common.label}>
              {CapitalizeFirst(t('loginAndRegistration.label.username'))}
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
              {CapitalizeFirst(t('loginAndRegistration.label.password'))}
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

            { showRecaptcha ?
              <ReCaptcha
                onCheck={onCheckRecaptcha}
                extraData={recaptchaExtraData} />
            : null}

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
              <Text style={theme.common.buttonText}>
                {CapitalizeFirst(t('loginAndRegistration.button.logIn'))}
              </Text>
            </TouchableOpacity>
            <View style={[theme.common.row, {justifyContent: 'center'}]}>
              <TouchableOpacity
                disabled={loading}
                onPress={moveToTACScreen}>
                <Text style={[loading ? {color: theme.variables.disabled} : theme.common.linkBtn, {color: theme.variables.primary}]}>
                  {CapitalizeFirst(t('loginAndRegistration.button.recoverPassword'))}
                </Text>
              </TouchableOpacity>
              <Text>|</Text>
              <TouchableOpacity
                disabled={loading}
                onPress={moveToTACScreen}>
                <Text style={[loading ? {color: theme.variables.disabled} : theme.common.linkBtn, {color: theme.variables.primary}]}>
                  {CapitalizeFirst(t('loginAndRegistration.button.createAccount'))}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={[theme.common.p, {textAlign: 'center'}]}>
            {t('loginAndRegistration.chooseSignInOption')}
          </Text>

          <View style={theme.common.card}>
            <TouchableOpacity
              disabled={!canTPSignIn}
              style={[
                styles.signinButton,
                !canTPSignIn
                  ? theme.common.disabled
                  : null
              , {backgroundColor: '#4285F4'}]}
              onPress={googleSignIn}>
              <View style={styles.GoogleSigninButtonWrapper}>
                <Image
                  resizeMode='contain'
                  source={require('../../../assets/images/login/google_logo.png')} style={styles.signinButtonImage}/>
              </View>
              <Text style={styles.signinButtonText}>
                {CapitalizeFirst(t('loginAndRegistration.button.signInWithGoogle'))}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={!canTPSignIn}
              style={[
                styles.signinButton,
                !canTPSignIn
                  ? theme.common.disabled
                  : null
              , {backgroundColor: '#4267B2'}]}
              onPress={facebookSignIn}>
              <View style={styles.FacebookSigninButtonWrapper}>
                <Image
                  resizeMode='contain'
                  source={require('../../../assets/images/login/f_logo_RGB-White_58.png')} style={styles.signinButtonImage}/>
              </View>
              <Text style={styles.signinButtonText}>
                {CapitalizeFirst(t('loginAndRegistration.button.signInWithFacebook'))}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <LoginScreen.Footer />
      </ScrollView>
    </SafeAreaView>
  );
});

LoginScreen.navigationOptions = ({ screenProps: { t } }) => {
  return {
    headerShown: false
  };
};

LoginScreen.Header = () => {
  const { t } = useTranslation();
  return (
    <View style={{paddingTop: 30 }}>
    {
      image.loginAndRegistration.header &&
      <Image resizeMode='contain' style={{ alignSelf: 'center' }} source={image.loginAndRegistration.header} />
    }
      <Text style={styles.appTitle}>
        {CapitalizeFirst(t('loginAndRegistration.appTitle'))}
      </Text>
    </View>
  );
}

LoginScreen.Footer = () => {
  const { t } = useTranslation();
  return (
    <OpenURLButton url="https://www.seluxit.com/privacy">
      {CapitalizeFirst(t('loginAndRegistration.button.privacyNotice'))}
    </OpenURLButton>
  );
}

export function setHeader(comp) {
  LoginScreen.Header = comp;
}

export function setFooter(comp) {
  LoginScreen.Footer = comp;
}

LoginScreen.registerNavigateTo = 'RegisterScreen';

export default LoginScreen;
