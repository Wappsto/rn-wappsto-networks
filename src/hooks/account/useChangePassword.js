import { useState, useRef, useCallback, useEffect, useContext } from 'react';
import useRequest from 'wappsto-blanket/hooks/useRequest';
import useConnected from '../useConnected';
import useUser from '../useUser';
import { NavigationContext } from 'react-navigation';

const useField = (defaultValue = '') => {
  const [ text, setText ] = useState(defaultValue);
  const [ visible, setVisible ] = useState(false);
  const [ blurred, setBlurred ] = useState(false);

  const ref = useRef();

  const onBlur = useCallback(() => {
    setBlurred(true)
  }, []);

  const toggleVisible = useCallback(() => {
    setVisible(sp => !sp);
  }, []);

  const error = blurred && !text;

  return {
    text,
    setText,
    visible,
    toggleVisible,
    onBlur,
    blurred,
    ref,
    error
  }
}

const useChangePassword = () => {
  const navigation = useContext(NavigationContext);
  const { user, session } = useUser();
  const connected = useConnected();
  const { send, request } = useRequest();
  const userId = user && user.meta && user.meta.id;

  const currentPassword = useField();
  const newPassword = useField();
  const repeatPassword = useField();

  const [ successVisible, setSuccessVisible ] = useState(false);

  const loading =  request && request.status === 'pending';
  const canUpdate = connected && userId && !loading && !currentPassword.error && !newPassword.error && !repeatPassword.error;

  const moveToField = useCallback((field) => {
    if(field && field.current && field.current.focus){
      field.current.focus();
    }
  }, []);

  const update = () => {
    if(canUpdate){
      send({
        method: 'PATCH',
        url: `/register/${userId}`,
        body: {
          username: session.username,
          password: currentPassword.text,
          new_username: newPassword.text
        }
      });
    }
  };

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
    currentPassword,
    newPassword,
    repeatPassword,
    moveToField,
    canUpdate,
    update,
    request,
    loading,
    successVisible,
    hideSuccessPopup
  }
}

export default useChangePassword;
