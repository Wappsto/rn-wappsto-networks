import { useState, useRef, useCallback, useEffect } from 'react';
import { isEmail } from '../util/helpers';
import useRequest from 'wappsto-blanket/hooks/useRequest';
import useConnected from './useConnected';

const useRegisterUser = (navigation) => {
  const [ username, setUsername ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ repeatPassword, setRepeatPassword ] = useState('');
  const [ usernameBlurred, setUsernameBlurred ] = useState(false);
  const [ passwordBlurred, setPasswordBlurred] = useState(false);
  const [ repeatPasswordBlurred, setRepeatPasswordBlurred] = useState(false);
  const [ recaptcha, setRecaptcha ] = useState(false);
  const [ recaptchaReload, setRecaptchaReload ] = useState(0);
  const [ successVisible, setSuccessVisible ] = useState(false);
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

  useEffect(() => {
    if(request){
      if(request.status === 'success'){
        setSuccessVisible(true);
      } else if(request.status === 'error'){
        setRecaptchaReload(n => n + 1);
      }
    }
  }, [request]);

  const hideSuccessPopup = useCallback(() => {
    setSuccessVisible(false);
    navigation.navigate('LoginScreen');
  }, [navigation]);

  const loading = request && (request.status === 'pending' || request.status === 'success');
  const canRegister = connected && !loading && isEmail(username) && password && repeatPassword && password === repeatPassword && recaptcha;
  const usernameError = usernameBlurred && !isEmail(username);
  const passwordError = passwordBlurred && !password;
  const repeatPasswordError = repeatPasswordBlurred && repeatPassword !== password;

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
    recaptchaReload,
    passwordInputRef,
    repeatPasswordInputRef,
    canRegister,
    register,
    request,
    loading
  };
}

export default useRegisterUser;
