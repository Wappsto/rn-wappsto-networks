import { useState, useEffect, useRef, useCallback } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { GoogleSignin, statusCodes } from '@react-native-community/google-signin';
import firebase from 'react-native-firebase';
import { useDispatch } from 'react-redux';
import config from 'wappsto-redux/config';
import { removeRequest } from 'wappsto-redux/actions/request';
import useRequest from 'wappsto-blanket/hooks/useRequest';
import useConnected from '../hooks/useConnected';
import { isEmail } from '../util/helpers';

const useSignIn = (navigation) => {
  const connected = useConnected();
  const dispatch = useDispatch();
  const [ username, setUsername ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ recaptcha, setRecaptcha ] = useState();
  const [ showRecaptcha, setShowRecaptcha ] = useState('');
  const [ recaptchaExtraData, setRecaptchaExtraData ] = useState(0);
  const [ isSigninInProgress, setIsSigninInProgress ] = useState(false);
  const [ showPassword, setShowPassword ] = useState(false);
  const passwordInputRef = useRef();
  const fbSignInError = useRef(null);
  const { request, send } = useRequest();
  const errorNumber = useRef(0);

  const toggleShowPassword = useCallback(() => {
    setShowPassword(sp => !sp);
  }, []);

  const saveSession = (cRequest) => {
    AsyncStorage.setItem('session', JSON.stringify(cRequest.json));
  }

  const navigateToMain = useCallback(() => {
    navigation.navigate('MainScreen');
  }, [navigation]);

  const moveToPasswordField = useCallback(() => {
    const trimText = username.trim();
    if (trimText !== username) {
      setUsername(trimText);
    }
    passwordInputRef.current.focus();
  }, [username]);

  const handleTextChange = useCallback((text, type) => {
    let currentText;
    let set;
    if(type === 'username'){
      currentText = username;
      set = setUsername;
    } else {
      currentText = password;
      set = setPassword;
    }
    if (text.length - currentText.length === 1) {
      set(text);
    } else {
      set(text.trim());
    }
  }, [username, password]);

  const signIn = useCallback(() => {
    fbSignInError.current = null;
    send({
      method: 'POST',
      url: '/session',
      body: {
        username: username,
        password: password,
        captcha: recaptcha,
        remember_me: true
      }
    });
  }, [username, password, recaptcha, send]);

  const checkAndSignIn = useCallback(() => {
    if (isEmail(username) && password) {
      signIn();
    }
  }, [username, password, signIn]);

  const googleSignIn = useCallback(async() => {
    try {
      setIsSigninInProgress(true);
      await GoogleSignin.configure({
        webClientId: config.firebaseWebClientId,
      });
      const data = await GoogleSignin.signIn();
      GoogleSignin.signOut();
      fbSignInError.current = {
        id: 'fbSignInError',
        status: 'pending'
      };
      const credential = firebase.auth.GoogleAuthProvider.credential(
        data.idToken,
        data.accessToken,
      );
      const firebaseUserCredential = await firebase
        .auth()
        .signInWithCredential(credential);
      const token = await firebaseUserCredential.user.getIdToken();
      fbSignInError.current = null;
      send({
        method: 'POST',
        url: '/session',
        body: {
          firebase_token: token,
          remember_me: true
        }
      });
    } catch (error) {
      let code;
      if (error.code !== statusCodes.SIGN_IN_CANCELLED) {
        if (error.code === statusCodes.IN_PROGRESS) {
          // operation (f.e. sign in) is in progress already
          code = 'fbsi_in_progress';
        } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
          // play services not available or outdated
          code = 'fbsi_psna';
        } else {
          // some other error happened
          code = 'generic';
        }
        fbSignInError.current = {
          id: 'fbSignInError',
          status: 'error',
          json: {
            code,
          },
        };
      }
    }
    setIsSigninInProgress(false);
  }, [send]);

  const userLogged = (cRequest) => {
    dispatch(removeRequest(cRequest.id));
    saveSession(cRequest);
    navigateToMain();
  }

  useEffect(() => {
    if(request){
      if(request.status === 'success'){
        errorNumber.current = 0;
        setShowRecaptcha(false);
        userLogged(request);
      } else if(request.status === 'error'){
        errorNumber.current++;
        if(errorNumber.current > 3 || request.json.code === 9900007){
          if(!showRecaptcha){
            setShowRecaptcha(true);
          } else {
            setRecaptchaExtraData(n => n + 1);
          }
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [request]);

  const onCheckRecaptcha = useCallback((data) => {
    setRecaptcha(data);
  }, []);

  const postRequest = fbSignInError.current || request;
  const loading = postRequest && (postRequest.status === 'pending' || postRequest.status === 'success');
  const canTPSignIn = connected && !isSigninInProgress && !loading
  const canSignIn = canTPSignIn && isEmail(username) && password && (!showRecaptcha || recaptcha);

  return {
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
    postRequest,
    loading,
    showRecaptcha,
    recaptchaExtraData,
    onCheckRecaptcha
  }
}

export default useSignIn;
