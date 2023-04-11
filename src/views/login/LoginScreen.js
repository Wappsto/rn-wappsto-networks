import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text as RNText,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import VersionNumber from 'react-native-version-number';
import Button from '../../components/Button';
import Input from '../../components/Input';
import KeyboardAvoidingView from '../../components/KeyboardAvoidingView';
import LanguageButton from '../../components/LanguageButton';
import ReCaptcha from '../../components/ReCaptcha';
import RequestError from '../../components/RequestError';
import Text from '../../components/Text';
import NAV from '../../enums/navigation';
import useSignIn from '../../hooks/login/useSignIn';
import defaultImages from '../../theme/images';
import theme from '../../theme/themeExport';
import { CapitalizeEach, CapitalizeFirst, useTranslation } from '../../translations';
import Terms from './components/Terms';

const styles = StyleSheet.create({
  formLinkButtons: {
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  signinButton: {
    minWidth: 280,
    height: 48,
    marginVertical: 8,
    paddingRight: 10,
    borderRadius: 3,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signinButtonText: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
    color: theme.variables.signInButtonTheme === 'dark' ? '#ffffff' : '#000000',
  },
  GoogleSigninButtonWrapper: {
    backgroundColor: 'white',
    borderRadius: 2,
  },
  FacebookSigninButtonWrapper: {},
  AppleSigninButtonWrapper: {},
  signinButtonImage: {
    width: 25,
    height: 25,
    margin: 10,
  },
  headerImage: {
    alignSelf: 'center',
    width: '100%',
    height: 150,
  },
  appTitle: {
    fontSize: 25,
    padding: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    color: theme.variables.primary,
  },
  seperator: {
    alignSelf: 'center',
    width: 200,
    borderWidth: 0.5,
    borderColor: theme.variables.disabled,
    marginVertical: 25,
  },
  appleColor: {
    backgroundColor: theme.variables.signInButtonTheme === 'dark' ? '#000000' : '#ffffff',
  },
  googleColor: {
    backgroundColor: theme.variables.signInButtonTheme === 'dark' ? '#4285F4' : '#ffffff',
  },
  facebookColor: { backgroundColor: '#4267B2' },
  terms: {
    textAlign: 'center',
    marginBottom: 20,
  },
  footer: {
    textAlign: 'center',
  },
});

const LoginScreen = React.memo(() => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const navigateTo = to => () => navigation.navigate(to);
  const {
    username,
    password,
    moveToPasswordField,
    handleTextChange,
    passwordInputRef,
    captchaRef,
    showPassword,
    toggleShowPassword,
    checkAndSignIn,
    canSignIn,
    canTPSignIn,
    postRequest,
    loading,
    onCheckCaptcha,
    connected,
    googleSignIn,
    facebookSignIn,
    appleSignIn,
  } = useSignIn();

  return (
    <SafeAreaView style={theme.common.container}>
      <StatusBar
        backgroundColor={theme.variables.statusBarBgLight}
        barStyle={theme.variables.statusBarColorDark}
      />
      {connected === false && (
        <Text
          style={[theme.common.toastFullWidth, theme.common.warningPanel]}
          content={CapitalizeFirst(t('error:internetConnectionLost'))}
        />
      )}
      <KeyboardAvoidingView>
        <ScrollView>
          <LanguageButton />
          <LoginScreen.Header />
          <View style={theme.common.contentContainer}>
            <View style={styles.section}>
              <Input
                onChangeText={usernameText => handleTextChange(usernameText, 'username')}
                value={username}
                label={CapitalizeFirst(t('account:username'))}
                textContentType="emailAddress"
                autoCapitalize="none"
                onSubmitEditing={moveToPasswordField}
                keyboardType="email-address"
                returnKeyType="next"
                disabled={loading}
              />
              <Input
                inputRef={passwordInputRef}
                onChangeText={passwordText => handleTextChange(passwordText, 'password')}
                value={password}
                label={CapitalizeFirst(t('account:password'))}
                textContentType="password"
                autoCapitalize="none"
                returnKeyType="done"
                showPassword={showPassword}
                secureTextEntry={!showPassword}
                toggleShowPassword={toggleShowPassword}
                onSubmitEditing={checkAndSignIn}
                disabled={loading}
              />
              {loading && <ActivityIndicator size="large" color={theme.variables.spinnerColor} />}

              <ReCaptcha onCheck={onCheckCaptcha} captchaRef={captchaRef} />

              <RequestError request={postRequest} />
              <Button
                disabled={!canSignIn}
                style={!canSignIn && theme.common.disabled}
                onPress={checkAndSignIn}
                display="block"
                color="primary"
                text={CapitalizeFirst(t('account:signIn'))}
              />
              <View style={styles.formLinkButtons}>
                <Button
                  disabled={loading}
                  onPress={navigateTo(NAV.NOSESSION.LOST_PASSWD)}
                  type="link"
                  color="primary"
                  text={CapitalizeFirst(t('account:forgotPassword'))}
                />
                <Text content="|" />
                <Button
                  disabled={loading}
                  onPress={navigateTo(NAV.NOSESSION.REGISTER)}
                  type="link"
                  color="primary"
                  text={CapitalizeFirst(t('account:createAccount'))}
                />
              </View>
            </View>

            <View style={styles.seperator} />

            <Terms privacyLink={LoginScreen.PrivacyLink} termsLink={LoginScreen.TermsLink} />

            <View style={styles.section}>
              <TouchableOpacity
                disabled={!canTPSignIn}
                style={[
                  styles.signinButton,
                  styles.googleColor,
                  !canTPSignIn && theme.common.disabled,
                ]}
                onPress={googleSignIn}>
                <View style={styles.GoogleSigninButtonWrapper}>
                  <Image
                    resizeMode="contain"
                    source={require('../../../assets/images/login/google_logo.png')}
                    style={styles.signinButtonImage}
                  />
                </View>
                <RNText style={styles.signinButtonText}>
                  {CapitalizeFirst(t('account:signInWithGoogle'))}
                </RNText>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={!canTPSignIn}
                style={[
                  styles.signinButton,
                  styles.facebookColor,
                  !canTPSignIn && theme.common.disabled,
                ]}
                onPress={facebookSignIn}>
                <View style={styles.FacebookSigninButtonWrapper}>
                  <Image
                    resizeMode="contain"
                    source={require('../../../assets/images/login/f_logo_RGB-White_58.png')}
                    style={styles.signinButtonImage}
                  />
                </View>
                <RNText style={[styles.signinButtonText, { color: 'white' }]}>
                  {CapitalizeFirst(t('account:signInWithFacebook'))}
                </RNText>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={!canTPSignIn}
                style={[
                  styles.signinButton,
                  styles.appleColor,
                  !canTPSignIn && theme.common.disabled,
                ]}
                onPress={appleSignIn}>
                <View style={styles.AppleSigninButtonWrapper}>
                  <Image
                    resizeMode="contain"
                    source={
                      theme.variables.signInButtonTheme === 'dark'
                        ? require('../../../assets/images/login/apple-white.png')
                        : require('../../../assets/images/login/apple-black.png')
                    }
                    style={styles.signinButtonImage}
                  />
                </View>
                <RNText style={[styles.signinButtonText]}>
                  {CapitalizeFirst(t('account:signInWithApple'))}
                </RNText>
              </TouchableOpacity>
            </View>
          </View>
          <LoginScreen.Footer />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
});

//----------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------
//------------------------------------OVERRIDABLE-----------------------------------------------
//----------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------

LoginScreen.Header = () => {
  const { t } = useTranslation();
  return (
    <View style={styles.header}>
      {defaultImages.loginAndRegistration.header && (
        <Image
          resizeMode="contain"
          style={styles.headerImage}
          source={defaultImages.loginAndRegistration.header}
        />
      )}
      <RNText style={styles.appTitle}>{CapitalizeEach(t('appTitle'))}</RNText>
    </View>
  );
};

LoginScreen.Footer = () => {
  return (
    <RNText style={styles.footer}>
      <Text
        color="secondary"
        align="center"
        size={10}
        content={'v' + VersionNumber.appVersion + ' © Seluxit'}
      />
    </RNText>
  );
};

LoginScreen.TermsLink =
  'https://www.seluxit.com/legal/seluxit-cloud-solutions-terms-and-conditions/';

LoginScreen.PrivacyLink = 'https://www.seluxit.com/privacy';

export function setHeader(comp) {
  LoginScreen.Header = comp;
}

export function setFooter(comp) {
  LoginScreen.Footer = comp;
}

LoginScreen.registerNavigateTo = NAV.NOSESSION.REGISTER;

export default LoginScreen;
