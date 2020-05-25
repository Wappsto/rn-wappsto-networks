import { useState, useRef, useCallback, useEffect, useContext } from 'react';
import useRequest from 'wappsto-blanket/hooks/useRequest';
import useConnected from '../useConnected';
import useUser from '../useUser';
import { NavigationContext } from 'react-navigation';
import { isEmail } from '../../util/helpers';

const useChangeEmail = () => {
  const navigation = useContext(NavigationContext);
  const { user, session } = useUser();
  const [ username, setUsername ] = useState(session.username);
  const [ password, setPassword ] = useState('');
  const [ newUsername, setNewUsername ] = useState('');
  const passwordRef = useRef();
  const newUsernameRef = useRef();
  const [ usernameBlurred, setUsernameBlurred ] = useState(false);
  const [ passwordBlurred, setPasswordBlurred ] = useState(false);
  const [ newUsernameBlurred, setNewUsernameBlurred ] = useState(false);
  const [ showPassword, setShowPassword ] = useState(false);
  const [ successVisible, setSuccessVisible ] = useState(false);

  const connected = useConnected();
  const { send, request } = useRequest();
  const userId = user && user.meta && user.meta.id;

  const usernameError = usernameBlurred && !isEmail(username);
  const passwordError = passwordBlurred && !password;
  const newUsernameError = newUsernameBlurred && !isEmail(newUsername);
  const canUpdate = connected && userId && isEmail(username) && password && isEmail(newUsername);
  const loading =  request && request.status === 'pending';

  const moveToField = useCallback((field) => {
    if(field && field.current && field.current.focus){
      field.current.focus();
    }
  }, []);

  const toggleShowPassword = useCallback(() => {
    setShowPassword(sp => !sp);
  }, []);

  const update = useCallback(() => {
    if(canUpdate){
      send({
        method: 'PATCH',
        url: `/register/${userId}`,
        body: {
          username: username,
          new_username: newUsername,
          password: password
        }
      });
    }
  }, [canUpdate, send, username, password, newUsername, userId]);

  const onUsernameBlur = useCallback(() => { setUsernameBlurred(true) }, []);
  const onPasswordBlur = useCallback(() => { setPasswordBlurred(true) }, []);
  const onNewUsernameBlur = useCallback(() => { setNewUsernameBlurred(true) }, []);

  const hideSuccessPopup = useCallback(() => {
    setSuccessVisible(false);
    navigation.goBack();
  }, [navigation]);

  useEffect(() => {
    if(request){
      if(request.status === 'success'){
        setSuccessVisible(true);
      }
    }
  }, [request]);

  return {
    username,
    setUsername,
    password,
    setPassword,
    newUsername,
    setNewUsername,
    onUsernameBlur,
    onPasswordBlur,
    onNewUsernameBlur,
    passwordRef,
    newUsernameRef,
    usernameError,
    passwordError,
    newUsernameError,
    moveToField,
    canUpdate,
    update,
    request,
    loading,
    showPassword,
    toggleShowPassword,
    successVisible,
    hideSuccessPopup
  }
}

export default useChangeEmail;
