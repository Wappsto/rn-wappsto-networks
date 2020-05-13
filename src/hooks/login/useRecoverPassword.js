import { useState, useCallback } from 'react';
import { isEmail } from '../../util/helpers';
import useRequest from 'wappsto-blanket/hooks/useRequest';
import useConnected from '../useConnected';

const useRecoverPassword = () => {
  const [ email, setEmail ] = useState('');
  const [ emailBlurred, setEmailBlurred ] = useState(false);
  const connected = useConnected();
  const { request, send } = useRequest();

  const ie = isEmail(email);
  const loading =  request && request.status === 'pending';
  const canRecoverPassword = !loading && connected && ie;
  const emailError = emailBlurred && !isEmail(email);

  const recoverPassword = useCallback(() => {
    if(canRecoverPassword){
      send({
        method: 'PATCH',
        url: '/register?request=recovery_password',
        body: {
          username: email
        }
      });
    }
  }, [canRecoverPassword, email, send]);


  return {
    email,
    setEmail,
    canRecoverPassword,
    recoverPassword,
    request,
    loading,
    emailError,
    setEmailBlurred,
  }
}

export default useRecoverPassword;
