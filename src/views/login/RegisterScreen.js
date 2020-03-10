import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StatusBar, ScrollView } from 'react-native';
import Screen from '../../components/Screen';
import { useTranslation, CapitalizeFirst, CapitalizeEach } from '../../translations';
import theme from '../../theme/themeExport';
import RequestError from '../../components/RequestError';
import ReCaptcha from '../../components/ReCaptcha';
import Popup from '../../components/Popup';
import useRegisterUser from '../../hooks/useRegisterUser';

const RegisterScreen = React.memo(({ navigation }) => {
  const { t } = useTranslation();
  const {
    successVisible,
    hideSuccessPopup,
    username,
    usernameError,
    setUsernameBlurred,
    password,
    passwordError,
    setPasswordBlurred,
    repeatPassword,
    repeatPasswordError,
    setRepeatPasswordBlurred,
    moveToNextField,
    handleTextChange,
    onCheckRecaptcha,
    recaptchaReload,
    passwordInputRef,
    repeatPasswordInputRef,
    canRegister,
    register,
    request,
    loading
  } = useRegisterUser(navigation);

  return (
    <Screen>
      <ScrollView>
        <StatusBar
          backgroundColor={theme.variables.white}
          barStyle='dark-content'
        />
        <Popup visible={successVisible} onRequestClose={hideSuccessPopup} hide={hideSuccessPopup} hideCloseIcon>
          <Text style={[theme.common.H1, theme.common.header, theme.common.success]}>{CapitalizeFirst(t('register.success.title'))}</Text>
          <Text style={theme.common.infoText}>{CapitalizeFirst(t('register.success.description'))}</Text>
          <TouchableOpacity style={[theme.common.button, theme.common.success]} onPress={hideSuccessPopup}>
            <Text>{CapitalizeFirst(t('ok'))}</Text>
          </TouchableOpacity>
        </Popup>
        <View style={theme.common.formElements}>
          <Text style={theme.common.label}>
            {CapitalizeFirst(t('email'))}
          </Text>
          <TextInput
            style={[theme.common.input, usernameError ? theme.common.error : null]}
            onChangeText={usernameText =>
              handleTextChange(usernameText, 'username')
            }
            value={username}
            onBlur={() => setUsernameBlurred(true)}
            textContentType='emailAddress'
            autoCapitalize='none'
            onSubmitEditing={() => moveToNextField('username')}
            keyboardType='email-address'
            returnKeyType='next'
            disabled={loading}
          />
          { usernameError &&
            <Text style={[theme.common.error, theme.common.spaceBottom]}>{CapitalizeFirst(t('register.error.username'))}</Text>
          }
          <Text style={theme.common.label}>
            {CapitalizeFirst(t('password'))}
          </Text>
          <TextInput
            ref={passwordInputRef}
            style={[theme.common.input, passwordError ? theme.common.error : null]}
            onChangeText={passwordText =>
              handleTextChange(passwordText, 'password')
            }
            value={password}
            onBlur={() => setPasswordBlurred(true)}
            textContentType='password'
            secureTextEntry={true}
            autoCapitalize='none'
            returnKeyType='done'
            onSubmitEditing={() => moveToNextField('password')}
            disabled={loading}
          />
          { passwordError &&
            <Text style={[theme.common.error, theme.common.spaceBottom]}>{CapitalizeFirst(t('register.error.password'))}</Text>
          }
          <Text style={theme.common.label}>
            {CapitalizeFirst(t('repeatPassword'))}
          </Text>
          <TextInput
            ref={repeatPasswordInputRef}
            style={[theme.common.input, repeatPasswordError ? theme.common.error : theme.common.spaceBottom]}
            onChangeText={repeatPasswordText =>
              handleTextChange(repeatPasswordText, 'repeatPassword')
            }
            value={repeatPassword}
            onBlur={() => setRepeatPasswordBlurred(true)}
            textContentType='password'
            secureTextEntry={true}
            autoCapitalize='none'
            returnKeyType='done'
            onSubmitEditing={register}
            disabled={loading}
          />
          { repeatPasswordError &&
            <Text style={[theme.common.error, theme.common.spaceBottom]}>{CapitalizeFirst(t('register.error.repeatPassword'))}</Text>
          }
          <ReCaptcha onCheck={onCheckRecaptcha} extraData={recaptchaReload} />
          {loading && (
            <ActivityIndicator size='large' color={theme.variables.primary} />
          )}
          <RequestError request={request} />
          <TouchableOpacity
            disabled={!canRegister}
            style={[
              theme.common.button,
              !canRegister
                ? theme.common.disabled
                : null,
            ]}
            onPress={register}>
            <Text style={theme.common.btnText}>
              {CapitalizeFirst(t('register'))}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Screen>
  )
});

RegisterScreen.navigationOptions = ({ screenProps: { t } }) => {
  return {
    ...theme.headerStyle,
    title: CapitalizeEach(t('pageTitle.register'))
  };
};

export default RegisterScreen;
