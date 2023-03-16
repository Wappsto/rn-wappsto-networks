import { useCallback } from 'react';
import useRequest from 'wappsto-blanket/hooks/useRequest';
import useConnected from '../useConnected';
import useUser from '../useUser';
import useField from '../useField';
import useRequestSuccessPopup from './useRequestSuccessPopup';

const useChangePassword = () => {
  const { user } = useUser();
  const connected = useConnected();
  const { send, request } = useRequest();
  const requestSuccessHandler = useRequestSuccessPopup(request);
  const userId = user && user.meta && user.meta.id;

  const currentPassword = useField();
  const newPassword = useField();
  const repeatPassword = useField();

  const loading = request && request.status === 'pending';
  const canUpdate =
    connected &&
    userId &&
    !loading &&
    !currentPassword.error &&
    !newPassword.error &&
    !repeatPassword.error;

  const moveToField = useCallback((field) => {
    if (field && field.current && field.current.focus) {
      field.current.focus();
    }
  }, []);

  const update = () => {
    if (canUpdate) {
      send({
        method: 'PATCH',
        url: `/register/${userId}`,
        body: {
          password: currentPassword.text,
          new_password: newPassword.text,
        },
      });
    }
  };

  return {
    currentPassword,
    newPassword,
    repeatPassword,
    moveToField,
    canUpdate,
    update,
    request,
    loading,
    ...requestSuccessHandler,
  };
};

export default useChangePassword;
