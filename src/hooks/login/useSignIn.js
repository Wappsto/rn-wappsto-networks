import { appleAuth, appleAuthAndroid } from '@invertase/react-native-apple-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import { AccessToken, LoginManager } from 'react-native-fbsdk';
import { useDispatch } from 'react-redux';
import uuid from 'uuid/v4';
import { useRequest } from 'wappsto-blanket';
import { addSession, config, removeRequest } from 'wappsto-redux';
import { isEmail } from '../../util/helpers';
import useConnected from '../useConnected';

const useSignIn = navigation => {
  const connected = useConnected();
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showError, setShowError] = useState(false);
  const [showRecaptcha, setShowRecaptcha] = useState('');
  const [isSigninInProgress, setIsSigninInProgress] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const passwordInputRef = useRef();
  const [fbSignInError, setFbSignInError] = useState(null);
  const { request, send, removeRequest: remove } = useRequest();
  const errorNumber = useRef(0);
  const recaptchaRef = useRef();

  const r = fbSignInError || request;
  const postRequest = showError && r;
  const loading =
    r &&
    (r.status === 'pending' ||
      r.status === 'success' ||
      (r.status === 'error' && r.json?.code === 9900007 && !showRecaptcha));
  const canTPSignIn = connected && !isSigninInProgress && !loading;
  const canSignIn = canTPSignIn && isEmail(username) && password;

  const toggleShowPassword = useCallback(() => {
    setShowPassword(sp => !sp);
  }, []);

  const saveSession = cRequest => {
    AsyncStorage.setItem('session', JSON.stringify(cRequest.json));
  };

  const moveToPasswordField = useCallback(() => {
    const trimText = username.trim();
    if (trimText !== username) {
      setUsername(trimText);
    }
    passwordInputRef.current.focus();
  }, [username]);

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
    recaptcha => {
      setShowError(false);
      setFbSignInError(null);
      send({
        method: 'POST',
        url: '/session',
        body: {
          username: username,
          password: password,
          captcha: recaptcha,
          remember_me: true,
        },
      });
    },
    [username, password, send],
  );

  const checkAndSignIn = useCallback(() => {
    if (isEmail(username) && password) {
      if (showRecaptcha && recaptchaRef.current) {
        recaptchaRef.current.show();
      } else {
        signIn();
      }
    }
  }, [username, password, signIn, showRecaptcha]);

  // ----------------- 3rd Auth Signin ----------------------------
  const sendAuthRequest = useCallback(
    token => {
      setShowError(false);
      setFbSignInError(null);
      send({
        method: 'POST',
        url: '/session',
        body: {
          firebase_token: token,
          remember_me: true,
        },
      });
    },
    [send],
  );

  const googleSignIn = useCallback(async () => {
    const id = 'fbSignInError' + Math.random();
    try {
      setIsSigninInProgress(true);
      await GoogleSignin.configure({
        webClientId: config.firebaseWebClientId,
      });
      const data = await GoogleSignin.signIn();
      GoogleSignin.signOut();
      setFbSignInError({
        id,
        status: 'pending',
      });
      const credential = auth.GoogleAuthProvider.credential(data.idToken, data.accessToken);
      const firebaseUserCredential = await auth().signInWithCredential(credential);
      const token = await firebaseUserCredential.user.getIdToken();
      sendAuthRequest(token);
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
        setShowError(true);
        setFbSignInError({
          id,
          status: 'error',
          json: {
            code,
          },
        });
      }
    }
    setIsSigninInProgress(false);
  }, [sendAuthRequest]);

  const facebookSignIn = useCallback(async () => {
    const id = 'fbSignInError' + Math.random();
    try {
      setIsSigninInProgress(true);
      const behavior = Platform.OS === 'ios' ? 'browser' : 'WEB_ONLY';
      LoginManager.setLoginBehavior(behavior);
      LoginManager.logOut();
      const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
      if (result.isCancelled) {
        setFbSignInError({
          id,
        });
        setIsSigninInProgress(false);
        return;
      }
      setFbSignInError({
        id,
        status: 'pending',
      });
      const data = await AccessToken.getCurrentAccessToken();
      if (!data) {
        throw new Error('Something went wrong obtaining the users access token');
      }
      const credential = auth.FacebookAuthProvider.credential(data.accessToken);
      const firebaseUserCredential = await auth().signInWithCredential(credential);
      const token = await firebaseUserCredential.user.getIdToken();
      sendAuthRequest(token);
    } catch (e) {
      setShowError(true);
      setFbSignInError({
        id,
        status: 'error',
        json: {},
      });
    }
    setIsSigninInProgress(false);
  }, [sendAuthRequest]);

  const appleSignIn = useCallback(async () => {
    const id = 'fbSignInError' + Math.random();
    try {
      setIsSigninInProgress(true);

      // Start the sign-in request
      let appleAuthResponse, idToken, nonce;
      if (Platform.OS === 'ios') {
        appleAuthResponse = await appleAuth.performRequest({
          requestedOperation: appleAuth.Operation.LOGIN,
          requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
        });
        idToken = appleAuthResponse.identityToken;
        nonce = appleAuthResponse.nonce;
      } else {
        const rawNonce = uuid();
        const state = uuid();

        // Configure the request
        appleAuthAndroid.configure({
          // The Service ID you registered with Apple
          clientId: 'com.wappsto.web',

          // Return URL added to your Apple dev console. We intercept this redirect, but it must still match
          // the URL you provided to Apple. It can be an empty route on your backend as it's never called.
          redirectUri: 'https://wappsto-941e8.firebaseapp.com/__/auth/handler',

          // The type of response requested - code, id_token, or both.
          responseType: appleAuthAndroid.ResponseType.ALL,

          // The amount of user information requested from Apple.
          scope: appleAuthAndroid.Scope.ALL,

          // Random nonce value that will be SHA256 hashed before sending to Apple.
          nonce: rawNonce,

          // Unique state value used to prevent CSRF attacks. A UUID will be generated if nothing is provided.
          state,
        });

        appleAuthResponse = await appleAuthAndroid.signIn();
        idToken = appleAuthResponse.id_token;
        nonce = appleAuthResponse.nonce;
      }

      // Ensure Apple returned a user identityToken
      if (!idToken) {
        setFbSignInError({
          id,
        });
        setIsSigninInProgress(false);
        return;
      }

      setFbSignInError({
        id,
        status: 'pending',
      });

      // Create a Firebase credential from the response
      const credential = auth.AppleAuthProvider.credential(idToken, nonce);
      const firebaseUserCredential = await auth().signInWithCredential(credential);
      const token = await firebaseUserCredential.user.getIdToken();
      sendAuthRequest(token);
    } catch (e) {
      setShowError(true);
      setFbSignInError({
        id,
        status: 'error',
        json: {},
      });
    }
    setIsSigninInProgress(false);
  }, [sendAuthRequest]);
  // --------------------------------------------------------------------

  const userLogged = cRequest => {
    dispatch(removeRequest(cRequest.id));
    dispatch(addSession(cRequest.json));
    saveSession(cRequest);
  };

  useEffect(() => {
    if (request) {
      if (request.status === 'success') {
        errorNumber.current = 0;
        setShowError(false);
        setShowRecaptcha(false);
        userLogged(request);
      } else if (request.status === 'error') {
        errorNumber.current++;
        if (
          !showRecaptcha &&
          (errorNumber.current > 2 || (request.json && request.json.code === 9900007))
        ) {
          setShowRecaptcha(true);
          recaptchaRef.current.show();
        } else {
          setShowError(true);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [request]);

  const onCheckRecaptcha = useCallback(
    data => {
      if (data) {
        if (['cancel', 'error', 'expired'].includes(data)) {
          if (recaptchaRef.current) {
            remove();
            recaptchaRef.current.hide();
          }
          return;
        } else {
          setTimeout(() => {
            if (recaptchaRef.current) {
              recaptchaRef.current.hide();
            }
            signIn(data);
          }, 1500);
        }
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
    recaptchaRef,
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
    loading,
    showRecaptcha,
    onCheckRecaptcha,
    connected,
  };
};

export default useSignIn;
