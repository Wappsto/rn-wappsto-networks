import { useCallback, useEffect } from 'react';
import useRequest from 'wappsto-blanket/hooks/useRequest';
import useVisible from 'wappsto-blanket/hooks/useVisible';
import useConnected from '../useConnected';
import useRequestSuccessPopup from './useRequestSuccessPopup';

const useDeleteAccount = (setLoading) => {
  const connected = useConnected();
  const { send, request } = useRequest();
  const requestSuccessHandler = useRequestSuccessPopup(request);
  const [ confirmationPopupVisible, showConfirmationPopup, hideConfirmationPopup ] = useVisible(false);

  const loading =  request && request.status === 'pending';
  const canDelete = connected && !loading;

  const sendDelete = useCallback(() => {
    if(canDelete){
      send({
        method: 'POST',
        url: '/register?request=delete_user',
        body: {}
      });
    }
  }, [canDelete, send]);

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
    ...requestSuccessHandler
  }
}

export default useDeleteAccount;
