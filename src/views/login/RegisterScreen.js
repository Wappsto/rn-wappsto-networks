import React, { useState, useRef, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StatusBar, ScrollView } from 'react-native';
import Screen from '../../components/Screen';
import { useTranslation, CapitalizeFirst, CapitalizeEach } from '../../translations';
import theme from '../../theme/themeExport';
import RequestError from '../../components/RequestError';
import { isEmail } from '../../util/helpers';
import useRequest from 'wappsto-blanket/hooks/useRequest';
import useConnected from '../../hooks/useConnected';
import ReCaptcha from '../../components/ReCaptcha';

const RegisterScreen = React.memo(({ navigation }) => {
  const { t } = useTranslation();
  const [ username, setUsername ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ repeatPassword, setRepeatPassword ] = useState('');
  const [ usernameBlurred, setUsernameBlurred ] = useState(false);
  const [ passwordBlurred, setPasswordBlurred] = useState(false);
  const [ repeatPasswordBlurred, setRepeatPasswordBlurred] = useState(false);
  const [ recaptcha, setRecaptcha ] = useState(false);
  const passwordInputRef = useRef();
  const repeatPasswordInputRef = useRef();
  const map = {
    username: {
      value: username,
      set: setUsername,
      nextField: passwordInputRef
    },
    password: {
      value: password,
      set: setPassword,
      nextField: repeatPasswordInputRef
    },
    repeatPassword: {
      value: repeatPassword,
      set: setRepeatPassword
    }
  };

  const connected = useConnected();
  const { request, send } = useRequest();


  const handleTextChange = useCallback((text, type) => {
    if (text.length - map[type].value.length === 1) {
      map[type].set(text);
    } else {
      map[type].set(text.trim());
    }
  }, [map]);

  const moveToNextField = useCallback((field) => {
    const trimText = map[field].value.trim();
    if (trimText !== map[field].value) {
      setUsername(trimText);
    }
    map[field].nextField.current.focus();
  }, [map]);

  const onCheckRecaptcha = useCallback((data) => {
    setRecaptcha(data);
  }, [])

  const register = useCallback(() => {
    if(canRegister){
      send({
        method: 'POST',
        url: '/register',
        body: {
          username: username,
          password: password,
          captcha: recaptcha
        }
      });
    }
  }, [username, password, recaptcha, send, canRegister]);

  const loading = request && (request.status === 'pending' || request.status === 'success');
  const canRegister = connected && !loading && isEmail(username) && password && repeatPassword && password === repeatPassword && recaptcha;
  const usernameError = usernameBlurred && !isEmail(username);
  const passwordError = passwordBlurred && !password;
  const repeatPasswordError = repeatPasswordBlurred && repeatPassword !== password;

  return (
    <Screen>
      <ScrollView>
        <StatusBar
          backgroundColor={theme.variables.white}
          barStyle='dark-content'
        />
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
            style={[theme.common.input, repeatPasswordError ? theme.common.error : null]}
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
          {loading && (
            <ActivityIndicator size='large' color={theme.variables.primary} />
          )}
          <ReCaptcha
            url='https://qa.wappsto.com'
            onCheck={onCheckRecaptcha}
          />
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
