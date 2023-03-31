import { appleAuth, appleAuthAndroid } from '@invertase/react-native-apple-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import { AccessToken, LoginManager } from 'react-native-fbsdk-next';
import uuid from 'react-native-uuid';
import { useDispatch } from 'react-redux';
import { addSession, config } from 'wappsto-redux';
import FB from '../../enums/firebase';
import RESPONSE_CODE from '../../enums/response-codes';
import STATUS from '../../enums/status';
import STORAGE from '../../enums/storageKeys';
import { isEmail } from '../../util/helpers';
import useApi from '../useApi';
import useConnected from '../useConnected';

const useSignIn = () => {
  const connected = useConnected();
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showError, setShowError] = useState(false);
  const [showCaptcha, setShowCaptcha] = useState('');
  const [isSigninInProgress, setIsSigninInProgress] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const passwordInputRef = useRef();
  const [fbSignInError, setFbSignInError] = useState(null);
  const errorNumber = useRef(0);
  const captchaRef = useRef();
  const { request, removeRequest: remove, ...session } = useApi('/session');

  const r = fbSignInError || request;
  const postRequest = showError && r;
  const loading =
    r?.status === STATUS.PENDING ||
    r?.status === STATUS.SUCCESS ||
    (r?.status === STATUS.ERROR &&
      r?.json?.code === RESPONSE_CODE.CAPTCHA_GOOGLE_ERROR &&
      !showCaptcha);
  const canTPSignIn = connected && !isSigninInProgress && !loading;
  const canSignIn = canTPSignIn && isEmail(username) && password;

  const saveSession = req => {
    try {
      AsyncStorage.setItem(STORAGE.SESSION, JSON.stringify(req.json));
    } catch (e) {
      console.error('When trying to sign in we got:', e);
    }
  };

  const moveToPasswordField = useCallback(() => {
    const trimText = username.trim();
    if (trimText !== username) {
      setUsername(trimText);
    }
    passwordInputRef.current.focus();
  }, [username]);

  const toggleShowPassword = useCallback(() => {
    setShowPassword(p => !p);
  }, []);

  const handleTextChange = useCallback(
    (text, type) => {
      let currentText;
      let set;
      if (type === 'username') {
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
    },
    [username, password],
  );

  const signIn = useCallback(
    captcha => {
      setShowError(false);
      setFbSignInError(null);
      session.post({
        username,
        password,
        captcha,
        remember_me: true,
      });
    },
    [username, password, session],
  );

  const checkAndSignIn = useCallback(() => {
    if (isEmail(username) && password) {
      if (showCaptcha && captchaRef.current) {
        captchaRef.current.open();
      } else {
        signIn(undefined);
      }
    }
  }, [username, password, signIn, showCaptcha]);

  // ----------------- 3rd Auth Signin ----------------------------
  const sendAuthRequest = useCallback(
    firebase_token => {
      setShowError(false);
      setFbSignInError(null);
      session.post({ firebase_token, remember_me: true });
    },
    [session],
  );

  const fbSignInErrorId = () => `fbSignInError::${uuid.v4()}`;

  const authenticateWithCredential = useCallback(
    async credential => {
      const fbUsrCred = await auth().signInWithCredential(credential);
      const token = await fbUsrCred.user.getIdToken();
      sendAuthRequest(token);
    },
    [sendAuthRequest],
  );

  const googleSignIn = useCallback(async () => {
    const id = fbSignInErrorId();
    try {
      setIsSigninInProgress(true);
      GoogleSignin.configure({
        webClientId: config.firebaseWebClientId,
      });

      const { idToken } = await GoogleSignin.signIn();
      GoogleSignin.signOut();
      setFbSignInError({ id, status: STATUS.PENDING });
      const credential = auth.GoogleAuthProvider.credential(idToken);
      await authenticateWithCredential(credential);
    } catch (err) {
      if (err.code !== statusCodes.SIGN_IN_CANCELLED) {
        const code =
          err.code === statusCodes.IN_PROGRESS
            ? FB.IN_PROGRESS
            : err.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE
            ? FB.PLAY_SERVICES_NOT_AVAILABLE
            : FB.GENERIC;
        setShowError(true);
        setFbSignInError({ id, status: STATUS.ERROR, json: { code } });
      }
    }

    setIsSigninInProgress(false);
  }, [authenticateWithCredential]);

  const facebookSignIn = useCallback(async () => {
    const id = fbSignInErrorId();
    try {
      setIsSigninInProgress(true);
      const behaviour = Platform.OS === 'ios' ? 'browser' : 'web_only';
      LoginManager.setLoginBehavior(behaviour);
      LoginManager.logOut();
      const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
      if (result.isCancelled) {
        setFbSignInError({ id });
        setIsSigninInProgress(false);
        return;
      }
      setFbSignInError({ id, status: STATUS.PENDING });
      const data = await AccessToken.getCurrentAccessToken();
      if (!data) {
        throw new Error("Something went wrong trying to obtain the user's access token");
      }

      const credential = auth.FacebookAuthProvider.credential(data.accessToken);
      await authenticateWithCredential(credential);
    } catch (err) {
      setShowError(true);
      setFbSignInError({
        id,
        status: STATUS.ERROR,
        json: {},
      });
      setIsSigninInProgress(false);
    }
  }, [authenticateWithCredential]);

  const appleSignIn = useCallback(async () => {
    const id = fbSignInErrorId();
    try {
      setIsSigninInProgress(true);

      let idToken, nonce;
      if (Platform.OS === 'ios') {
        const appleAuthResponse = await appleAuth.performRequest({
          requestedOperation: appleAuth.Operation.LOGIN,
          requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
        });
        idToken = appleAuthResponse.identityToken;
        nonce = appleAuthResponse.nonce;
      } else {
        // configure req
        appleAuthAndroid.configure({
          // the service id registered with Apple
          clientId: 'com.wappsto.web',
          // return URL added to Apple dev console
          redirectUri: 'https://wappsto-941e8.firebaseapp.com/__/auth/handler', // check this also
          // the type of requested response: code, id_token, or all
          responseType: appleAuthAndroid.ResponseType.ALL,
          // the amount of user info requested from Apple
          scope: appleAuthAndroid.Scope.ALL,
          // random nonce
          nonce: uuid.v4(),
          // unique state value to prevent CSRF attacks
          state: uuid.v4(),
        });

        const appleAuthResponse = await appleAuthAndroid.signIn();
        idToken = appleAuthResponse.id_token;
        nonce = appleAuthResponse.nonce;
      }

      if (!idToken) {
        setFbSignInError({ id });
        setIsSigninInProgress(false);
        return;
      }

      setFbSignInError({ id, status: STATUS.PENDING });

      const credential = auth.AppleAuthProvider.credential(idToken, nonce);
      await authenticateWithCredential(credential);
    } catch (err) {
      setShowError(true);
      setFbSignInError({ id, status: STATUS.ERROR, json: {} });
    }

    setIsSigninInProgress(false);
  }, [authenticateWithCredential]);

  // --------------------------------------------------------------------

  const userLoggedIn = req => {
    remove();
    dispatch(addSession(request.json));
    saveSession(req);
  };

  useEffect(() => {
    if (!request) {
      return;
    }

    switch (request.status) {
      case STATUS.SUCCESS: {
        errorNumber.current = 0;
        setShowCaptcha(false);
        setShowError(false);
        setShowCaptcha(false);
        userLoggedIn(request);
        break;
      }
      case STATUS.ERROR: {
        errorNumber.current++;
        if (
          !showCaptcha &&
          (errorNumber.current > 2 ||
            (request.json && request.json.code === RESPONSE_CODE.CAPTCHA_GOOGLE_ERROR))
        ) {
          setShowCaptcha(true);
          captchaRef.current?.open();
        }
        setShowError(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [request]);

  const onCheckCaptcha = useCallback(
    data => {
      if (!data) {
        return;
      }

      if (['cancel', 'error', 'expired'].includes(data)) {
        if (captchaRef.current) {
          remove();
          captchaRef.current.close();
        }
        return;
      } else {
        setTimeout(() => {
          if (captchaRef.current) {
            captchaRef.current.close();
          }
          signIn(data);
        }, 500);
      }
    },
    [signIn, remove],
  );

  return {
    username,
    password,
    moveToPasswordField,
    handleTextChange,
    passwordInputRef,
    captchaRef,
    showPassword,
    toggleShowPassword,
    checkAndSignIn,
    canSignIn,
    signIn,
    canTPSignIn,
    postRequest,
    loading,
    showCaptcha,
    onCheckCaptcha,
    connected,
    googleSignIn,
    facebookSignIn,
    appleSignIn,
  };
};

export default useSignIn;
