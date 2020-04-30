import React, { useCallback } from 'react';
import { Image, View, Text as RNtext, Linking, TouchableOpacity, ActivityIndicator, StyleSheet, StatusBar, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppleButton } from '@invertase/react-native-apple-authentication';
import { useTranslation, CapitalizeFirst, CapitalizeEach } from '../../translations';
import useSignIn from '../../hooks/useSignIn';
import RequestError from '../../components/RequestError';
import ReCaptcha from '../../components/ReCaptcha';
import Input from '../../components/Input';
import Text from '../../components/Text';
import Button from '../../components/Button';
import theme from '../../theme/themeExport';
import defaultImages from '../../theme/images';

const OpenURLButton = ({ url, children }) => {
  const handlePress = useCallback(async () => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    }
  }, [url]);

  return (
    <Button
      type='link'
      onPress={handlePress}
      text={children}
    />
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
    fontSize:25,
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
    appleSignIn,
    postRequest,
    showRecaptcha,
    onCheckRecaptcha,
    recaptchaExtraData,
    loading
  } = useSignIn(navigation);

  const moveToTACScreen = useCallback(() => {
    navigation.navigate(LoginScreen.registerNavigateTo);
  }, [navigation]);

  const moveToRecoverPasswordScreen = useCallback(() => {
    navigation.navigate('RecoverPasswordScreen');
  }, [navigation]);

  return (
    <SafeAreaView style={theme.common.container}>
      <StatusBar backgroundColor={theme.variables.appBgColor} barStyle='dark-content' />
      <ScrollView>
        <LoginScreen.Header />
        <View style={theme.common.contentContainer}>
          <Text
            size='p'
            align='center'
            content={CapitalizeFirst(t('loginAndRegistration.loginWithEmail'))}
          />
          <View style={theme.common.card}>
            <Input
              onChangeText={usernameText =>
                handleTextChange(usernameText, 'username')
              }
              value={username}
              label={CapitalizeFirst(t('loginAndRegistration.label.username'))}
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
              label={CapitalizeFirst(t('loginAndRegistration.label.password'))}
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

            { showRecaptcha ?
              <ReCaptcha
                onCheck={onCheckRecaptcha}
                extraData={recaptchaExtraData} />
            : null}

            <RequestError request={postRequest} />
            <Button
              disabled={!canSignIn}
              style={!canSignIn && theme.common.disabled}
              onPress={signIn}
              display='block'
              color={!canSignIn ? 'disabled' : 'primary'}
              text={CapitalizeFirst(t('loginAndRegistration.button.logIn'))}
            />
          <View style={[theme.common.row, {justifyContent: 'center'}]}>
            <Button
              disabled={loading}
              onPress={moveToRecoverPasswordScreen}
              type='link'
              color={loading ? 'disabled' : 'primary'}
              text={CapitalizeFirst(t('loginAndRegistration.button.recoverPassword'))}
            />
            <Text content='|'/>
            <Button
              disabled={loading}
              onPress={moveToTACScreen}
              type='link'
              color={loading ? 'disabled' : 'primary'}
              text={CapitalizeFirst(t('loginAndRegistration.button.createAccount'))}
            />
            </View>
          </View>

          <Text
            size='p'
            align='center'
            content={t('loginAndRegistration.chooseSignInOption')}
          />

          <View style={theme.common.card}>
            <TouchableOpacity
              disabled={!canTPSignIn}
              style={[
                styles.signinButton,
                !canTPSignIn && theme.common.disabled,
                {backgroundColor: '#4285F4'}
              ]}
              onPress={googleSignIn}
            >
              <View style={styles.GoogleSigninButtonWrapper}>
                <Image
                  resizeMode='contain'
                  source={require('../../../assets/images/login/google_logo.png')} style={styles.signinButtonImage}/>
              </View>
              <RNtext style={styles.signinButtonText}>
                {CapitalizeFirst(t('loginAndRegistration.button.signInWithGoogle'))}
              </RNtext>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={!canTPSignIn}
              style={[
                styles.signinButton,
                !canTPSignIn && theme.common.disabled,
                {backgroundColor: '#4267B2'}
              ]}
              onPress={facebookSignIn}
            >
              <View style={styles.FacebookSigninButtonWrapper}>
                <Image
                  resizeMode='contain'
                  source={require('../../../assets/images/login/f_logo_RGB-White_58.png')} style={styles.signinButtonImage}/>
              </View>
              <RNtext style={styles.signinButtonText}>
                {CapitalizeFirst(t('loginAndRegistration.button.signInWithFacebook'))}
              </RNtext>
            </TouchableOpacity>
            {
              Platform.OS === 'ios' &&
              <AppleButton
                buttonStyle={AppleButton.Style.WHITE}
                buttonType={AppleButton.Type.SIGN_IN}
                style={[
                  styles.signinButton,
                  !canTPSignIn && theme.common.disabled
                ]}
                onPress={appleSignIn}
              />
            }
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
        defaultImages.loginAndRegistration.header &&
        <Image resizeMode='contain' style={{ alignSelf: 'center', maxWidth: "100%" }} source={defaultImages.loginAndRegistration.header} />
      }
      <RNtext style={styles.appTitle}>
        {CapitalizeEach(t('loginAndRegistration.appTitle'))}
      </RNtext>
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
