import React from 'react';
import { View, ActivityIndicator, ScrollView } from 'react-native';
import Screen from '../../components/Screen';
import Input from '../../components/Input';
import Text from '../../components/Text';
import Button from '../../components/Button';
import { useTranslation, CapitalizeFirst } from '../../translations';
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
    passwordInputRef,
    repeatPasswordInputRef,
    recaptchaRef,
    canRegister,
    register,
    request,
    loading
  } = useRegisterUser(navigation);

  return (
    <Screen>
      <ScrollView>
        <Popup visible={successVisible} onRequestClose={hideSuccessPopup} hide={hideSuccessPopup} hideCloseIcon>
          <Text
            size='p'
            align='center'
            content={CapitalizeFirst(t('loginAndRegistration.registrationConfirmationText'))}
          />
          <Button
            color='success'
            onPress={hideSuccessPopup}
            text={CapitalizeFirst(t('loginAndRegistration.button.ok'))}
          />
        </Popup>
        <View style={theme.common.contentContainer}>
          <Text
            size='p'
            align='center'
            content={CapitalizeFirst(t('loginAndRegistration.registrationText'))}
          />
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
            inputRef={passwordInputRef}
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
            inputRef={repeatPasswordInputRef}
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
          <ReCaptcha onCheck={onCheckRecaptcha} recaptchaRef={recaptchaRef} />
          {loading && (
            <ActivityIndicator size='large' color={theme.variables.spinnerColor} />
          )}
          <RequestError request={request} />
          <Button
            disabled={!canRegister}
            color={!canRegister ? 'disabled' : 'primary'}
            onPress={register}
            display='block'
            text={CapitalizeFirst(t('loginAndRegistration.button.register'))}
          />
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
