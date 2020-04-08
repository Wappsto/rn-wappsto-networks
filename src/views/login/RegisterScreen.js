import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StatusBar, ScrollView } from 'react-native';
import Screen from '../../components/Screen';
import Input from '../../components/Input';
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
          backgroundColor={theme.variables.primary}
          barStyle='light-content'
        />
        <Popup visible={successVisible} onRequestClose={hideSuccessPopup} hide={hideSuccessPopup} hideCloseIcon>
          <Text style={theme.common.infoText}>{CapitalizeFirst(t('loginAndRegistration.registrationConfirmationText'))}</Text>
          <TouchableOpacity style={[theme.common.button, theme.common.success]} onPress={hideSuccessPopup}>
            <Text>{CapitalizeFirst(t('loginAndRegistration.button.ok'))}</Text>
          </TouchableOpacity>
        </Popup>
        <View style={theme.common.contentContainer}>
          <Text style={theme.common.infoText}>{CapitalizeFirst(t('loginAndRegistration.registrationText'))}</Text>
          <Input
            label={CapitalizeFirst(t('loginAndRegistration.label.username'))}
            style={usernameError && theme.common.error}
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
            validationError={usernameError && CapitalizeFirst(t('loginAndRegistration.validation.username'))}
          />
          <Input
            ref={passwordInputRef}
            label={CapitalizeFirst(t('loginAndRegistration.label.password'))}
            style={passwordError && theme.common.error}
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
            validationError={passwordError && CapitalizeFirst(t('loginAndRegistration.validation.password'))}
          />
          <Input
            ref={repeatPasswordInputRef}
            label={CapitalizeFirst(t('loginAndRegistration.label.repeatPassword'))}
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
            validationError={repeatPasswordError && CapitalizeFirst(t('loginAndRegistration.validation.repeatPassword'))}
          />
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
            <Text style={theme.common.buttonText}>
              {CapitalizeFirst(t('loginAndRegistration.button.register'))}
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
    title: CapitalizeFirst(t('loginAndRegistration.registerTitle'))
  };
};

export default RegisterScreen;
