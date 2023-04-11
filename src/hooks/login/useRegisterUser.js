import { useCallback, useEffect, useRef, useState } from 'react';
import HTTP from '../../enums/http';
import { isEmail } from '../../util/helpers';
import useConnected from '../useConnected';
import useRequest from '../useRequest';
import NAV from '../../enums/navigation';

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
  const { request, send, removeRequest } = useRequest();

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
        method: HTTP.POST,
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
      if (!data) {
        return;
      }

      if (['cancel', 'error', 'expired'].includes(data)) {
        if (recaptchaRef.current) {
          removeRequest();
          recaptchaRef.current.close();
        }
        return;
      } else {
        setTimeout(() => {
          if (recaptchaRef.current) {
            recaptchaRef.current.close();
          }

          sendRequest(data);
        }, 500);
      }
    },
    [sendRequest, removeRequest],
  );

  const register = useCallback(() => {
    if (canRegister) {
      if (recaptchaRef.current) {
        recaptchaRef.current.open();
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
    navigation.navigate(NAV.NOSESSION.LOGIN);
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
