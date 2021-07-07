import React, { useCallback } from 'react';
import { Image, View, Text as RNText, Linking, TouchableOpacity, ActivityIndicator, StyleSheet, StatusBar, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppleButton } from '@invertase/react-native-apple-authentication';
import { useTranslation, CapitalizeFirst, CapitalizeEach } from '../../translations';
import useSignIn from '../../hooks/login/useSignIn';
import RequestError from '../../components/RequestError';
import ReCaptcha from '../../components/ReCaptcha';
import KeyboardAvoidingView from '../../components/KeyboardAvoidingView';
import Input from '../../components/Input';
import Text from '../../components/Text';
import Button from '../../components/Button';
import LanguageButton from '../../components/LanguageButton';
import theme from '../../theme/themeExport';
import defaultImages from '../../theme/images';
import VersionNumber from 'react-native-version-number';

const styles = StyleSheet.create({
  formLinkButtons:{
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center'
  },
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
    color: theme.variables.signInButtonTheme === 'dark' ? '#ffffff' : '#000000'
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
  headerImage:{
    alignSelf: 'center',
    width: '100%',
    height: 150
  },
  appTitle:{
    fontSize:25,
    padding: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    color:theme.variables.primary
  },
  seperator:{
    alignSelf: 'center',
    width: 200,
    borderWidth: 0.5,
    borderColor: theme.variables.disabled,
    marginVertical: 25
  },
  googleColor: {backgroundColor: theme.variables.signInButtonTheme === 'dark' ? '#4285F4' : '#ffffff'},
  facebookColor: {backgroundColor: '#4267B2'},
  terms: {
    textAlign: 'center',
    marginBottom:20
  },
  footer: {
    textAlign: 'center'
  }
});

const TermsAndConditions = React.memo(({navigation}) => {
  const { t } = useTranslation();
  const text = CapitalizeFirst(t('account:acceptTermsWhenSignIn.message'));
  const terms = t('account:acceptTermsWhenSignIn.terms');
  const privacy = t('account:acceptTermsWhenSignIn.privacy');
  const components = text.split(new RegExp('(' + terms + '|' + privacy + ')'));
  return (
      <RNText style={styles.terms}>
      {
        components.map(str => {
          if(str === terms){
            return (
              <Text
                key={str}
                onPress={() => LoginScreen.onTermsPress(navigation)}
                size='p'
                color='primary'
                align='center'
                content={str}/>
            )
          }
          if(str === privacy){
            return (
              <Text
                key={str}
                onPress={() => LoginScreen.onPrivacyPress(navigation)}
                size='p'
                color='primary'
                align='center'
                content={str}/>
            )
          }
          return (
            <Text
              key={str}
              size='p'
              color='secondary'
              align='center'
              content={str}
            />
          );
        })
      }
      </RNText>
  )
});

const LoginScreen = React.memo(({ navigation }) => {
  const { t } = useTranslation();
  const {
    username,
    password,
    moveToPasswordField,
    handleTextChange,
    passwordInputRef,
    recaptchaRef,
    showPassword,
    toggleShowPassword,
    checkAndSignIn,
    canSignIn,
    canTPSignIn,
    googleSignIn,
    facebookSignIn,
    appleSignIn,
    postRequest,
    onCheckRecaptcha,
    loading,
    connected
  } = useSignIn(navigation);

  const moveToTACScreen = useCallback(() => {
    navigation.navigate('TermsAndConditionsScreen');
  }, [navigation]);

  const moveToRegisterScreen = useCallback(() => {
    navigation.navigate(LoginScreen.registerNavigateTo);
  }, [navigation]);

  const moveToRecoverPasswordScreen = useCallback(() => {
    navigation.navigate('RecoverPasswordScreen');
  }, [navigation]);

  return (
    <SafeAreaView style={theme.common.container}>
      <StatusBar backgroundColor={theme.variables.statusBarBgLight} barStyle={theme.variables.statusBarColorDark} />
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
                onChangeText={usernameText =>
                  handleTextChange(usernameText, 'username')
                }
                value={username}
                label={CapitalizeFirst(t('account:username'))}
                textContentType='emailAddress'
                autoCapitalize='none'
                onSubmitEditing={moveToPasswordField}
                keyboardType='email-address'
                returnKeyType='next'
                disabled={loading}
              />
              <Input
                inputRef={passwordInputRef}
                onChangeText={passwordText =>
                  handleTextChange(passwordText, 'password')
                }
                value={password}
                label={CapitalizeFirst(t('account:password'))}
                textContentType='password'
                autoCapitalize='none'
                returnKeyType='done'
                showPassword={showPassword}
                secureTextEntry={!showPassword}
                toggleShowPassword={toggleShowPassword}
                onSubmitEditing={checkAndSignIn}
                disabled={loading}
              />
              {loading && (
                <ActivityIndicator size='large' color={theme.variables.spinnerColor} />
              )}

              <ReCaptcha onCheck={onCheckRecaptcha} recaptchaRef={recaptchaRef} />

              <RequestError request={postRequest} />
              <Button
                disabled={!canSignIn}
                style={!canSignIn && theme.common.disabled}
                onPress={checkAndSignIn}
                display='block'
                color='primary'
                text={CapitalizeFirst(t('account:signIn'))}
              />
            <View style={styles.formLinkButtons}>
              <Button
                disabled={loading}
                onPress={moveToRecoverPasswordScreen}
                type='link'
                color='primary'
                text={CapitalizeFirst(t('account:forgotPassword'))}
              />
              <Text content='|'/>
              <Button
                disabled={loading}
                onPress={moveToRegisterScreen}
                type='link'
                color='primary'
                text={CapitalizeFirst(t('account:createAccount'))}
              />
              </View>
            </View>

            <View style={styles.seperator}/>

            <TermsAndConditions navigation={navigation}/>

            <View style={styles.section}>
              <TouchableOpacity
                disabled={!canTPSignIn}
                style={[
                  styles.signinButton,
                  styles.googleColor,
                  !canTPSignIn && theme.common.disabled
                ]}
                onPress={googleSignIn}
              >
                <View style={styles.GoogleSigninButtonWrapper}>
                  <Image
                    resizeMode='contain'
                    source={require('../../../assets/images/login/google_logo.png')} style={styles.signinButtonImage}/>
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
                  !canTPSignIn && theme.common.disabled
                ]}
                onPress={facebookSignIn}
              >
                <View style={styles.FacebookSigninButtonWrapper}>
                  <Image
                    resizeMode='contain'
                    source={require('../../../assets/images/login/f_logo_RGB-White_58.png')} style={styles.signinButtonImage}/>
                </View>
                <RNText style={[styles.signinButtonText, {color: 'white'}]}>
                  {CapitalizeFirst(t('account:signInWithFacebook'))}
                </RNText>
              </TouchableOpacity>
              <AppleButton
                buttonStyle={theme.variables.signInButtonTheme === 'dark' ?  AppleButton.Style.BLACK : AppleButton.Style.WHITE}
                buttonType={AppleButton.Type.SIGN_IN}
                style={[
                  styles.signinButton,
                  !canTPSignIn && theme.common.disabled
                ]}
                onPress={appleSignIn}
              />
            </View>
          </View>
          <LoginScreen.Footer />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
});

LoginScreen.navigationOptions = () => {
  const { t } = useTranslation();
  return {
    headerShown: false,
    title: CapitalizeFirst(t('pageTitle.login'))
  };
};

//----------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------
//------------------------------------OVERRIDABLE-----------------------------------------------
//----------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------

LoginScreen.Header = () => {
  const { t } = useTranslation();
  return (
    <View style={styles.header}>
      {
        defaultImages.loginAndRegistration.header &&
        <Image resizeMode='contain' style={styles.headerImage} source={defaultImages.loginAndRegistration.header} />
      }
      <RNText style={styles.appTitle}>
        {CapitalizeEach(t('appTitle'))}
      </RNText>
    </View>
  );
}

LoginScreen.Footer = () => {
  return (
    <RNText style={styles.footer}>
      <Text
        color='secondary'
        align='center'
        size={10}
        content={'v' + VersionNumber.appVersion + ' © '}
      />
      <Text
        bold
        onPress={() => handlePress('https://www.seluxit.com')}
        color='secondary'
        align='center'
        size={10}
        content={'Seluxit A/S'}
      />
    </RNText>
  );
}

const handlePress = async (url) => {
  const supported = await Linking.canOpenURL(url);
  if (supported) {
    await Linking.openURL(url);
  }
};
LoginScreen.onTermsPress = () => {
  handlePress('https://www.seluxit.com/legal/seluxit-cloud-solutions-terms-and-conditions/');
}

LoginScreen.onPrivacyPress = () => {
  handlePress('https://www.seluxit.com/privacy');
}

export function setHeader(comp) {
  LoginScreen.Header = comp;
}

export function setFooter(comp) {
  LoginScreen.Footer = comp;
}

LoginScreen.registerNavigateTo = 'RegisterScreen';

export default LoginScreen;
