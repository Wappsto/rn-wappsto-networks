import { useCallback, useEffect, useState } from 'react';
import useRequest from 'wappsto-blanket/hooks/useRequest';
import useVisible from 'wappsto-blanket/hooks/useVisible';
import useConnected from '../useConnected';
import useRequestSuccessPopup from './useRequestSuccessPopup';
import { isEmail } from '../../util/helpers';

const useDeleteAccount = (setLoading) => {
  const connected = useConnected();
  const { send, request } = useRequest();
  const requestSuccessHandler = useRequestSuccessPopup(request);
  const [ confirmationPopupVisible, showConfirmationPopup, hideConfirmationPopup ] = useVisible(false);
  const [ username, setUsername ] = useState('');

  const loading =  request && request.status === 'pending';
  const canDelete = connected && !loading;
  const canConfirmDelete = canDelete && isEmail(username);

  const sendDelete = useCallback(() => {
    if(canDelete){
      send({
        method: 'PATCH',
        url: '/register?request=delete_user',
        body: {
          username: username
        }
      });
    }
  }, [canDelete, send, username]);

  const confirmDelete = useCallback(() => {
    hideConfirmationPopup();
    sendDelete();
  }, [ sendDelete, hideConfirmationPopup ]);

  useEffect(() => {
    if(setLoading){
      if(request && request.status === 'pending'){
        setLoading(true);
      } else {
        setLoading(false);
      }
    }
  }, [setLoading, request])

  return {
    confirmationPopupVisible,
    showConfirmationPopup,
    hideConfirmationPopup,
    confirmDelete,
    canDelete,
    sendDelete,
    request,
    loading,
    username,
    setUsername,
    canConfirmDelete,
    ...requestSuccessHandler
  }
}

export default useDeleteAccount;
