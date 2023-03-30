import { useState, useRef, useCallback, useEffect } from 'react';
import { isEmail } from '../../util/helpers';
import { useRequest } from 'wappsto-blanket';
import useConnected from '../useConnected';

const useRegisterUser = navigation => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [usernameBlurred, setUsernameBlurred] = useState(false);
  const [passwordBlurred, setPasswordBlurred] = useState(false);
  const [repeatPasswordBlurred, setRepeatPasswordBlurred] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const passwordInputRef = useRef();
  const repeatPasswordInputRef = useRef();
  const recaptchaRef = useRef();
  const map = {
    username: {
      value: username,
      set: setUsername,
      nextField: passwordInputRef,
    },
    password: {
      value: password,
      set: setPassword,
      nextField: repeatPasswordInputRef,
    },
    repeatPassword: {
      value: repeatPassword,
      set: setRepeatPassword,
    },
  };

  const connected = useConnected();
  const { request, send } = useRequest();

  const loading = request && (request.status === 'pending' || request.status === 'success');
  const canRegister =
    connected &&
    !loading &&
    isEmail(username) &&
    password &&
    repeatPassword &&
    password === repeatPassword;
  const usernameError = usernameBlurred && !isEmail(username);
  const passwordError = passwordBlurred && !password;
  const repeatPasswordError = repeatPasswordBlurred && repeatPassword !== password;

  const handleTextChange = useCallback(
    (text, type) => {
      if (text.length - map[type].value.length === 1) {
        map[type].set(text);
      } else {
        map[type].set(text.trim());
      }
    },
    [map],
  );

  const moveToNextField = useCallback(
    field => {
      const trimText = map[field].value.trim();
      if (trimText !== map[field].value) {
        setUsername(trimText);
      }
      map[field].nextField.current.focus();
    },
    [map],
  );

  const sendRequest = useCallback(
    (recaptcha = '') => {
      send({
        method: 'POST',
        url: '/register',
        body: {
          username: username,
          password: password,
          captcha: recaptcha,
        },
      });
    },
    [username, password, send],
  );

  const onCheckRecaptcha = useCallback(
    data => {
      if (data) {
        if (['cancel', 'error', 'expired'].includes(data)) {
          if (recaptchaRef.current) {
            recaptchaRef.current.hide();
          }
          return;
        } else {
          setTimeout(() => {
            if (recaptchaRef.current) {
              recaptchaRef.current.hide();
            }
            sendRequest(data);
          }, 1500);
        }
      }
    },
    [sendRequest],
  );

  const register = useCallback(() => {
    if (canRegister) {
      if (recaptchaRef.current) {
        recaptchaRef.current.show();
      } else {
        sendRequest();
      }
    }
  }, [canRegister, sendRequest]);

  useEffect(() => {
    if (request) {
      if (request.status === 'success') {
        setSuccessVisible(true);
      }
    }
  }, [request]);

  const hideSuccessPopup = useCallback(() => {
    setSuccessVisible(false);
    navigation.navigate('LoginScreen');
  }, [navigation]);

  return {
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
    loading,
    connected,
  };
};

export default useRegisterUser;
