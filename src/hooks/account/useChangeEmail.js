import { useCallback } from 'react';
import { useRequest } from 'wappsto-blanket';
import useConnected from '../useConnected';
import useUser from '../useUser';
import useField from '../useField';
import { isEmail } from '../../util/helpers';
import useRequestSuccessPopup from './useRequestSuccessPopup';

const useChangeEmail = () => {
  const { user, session } = useUser();
  const usernameField = useField(session.username, isEmail);
  const passwordField = useField();
  const newUsernameField = useField('', isEmail);

  const connected = useConnected();
  const { send, request } = useRequest();
  const requestSuccessHandler = useRequestSuccessPopup(request);
  const userId = user && user.meta && user.meta.id;

  const loading = request && request.status === 'pending';
  const canUpdate =
    connected &&
    userId &&
    isEmail(usernameField.text) &&
    passwordField.text &&
    isEmail(newUsernameField.text) &&
    !loading;

  const moveToField = useCallback(field => {
    if (field && field.current && field.current.focus) {
      field.current.focus();
    }
  }, []);

  const username = usernameField.text;
  const newUsername = newUsernameField.text;
  const password = passwordField.text;
  const update = useCallback(() => {
    if (canUpdate) {
      send({
        method: 'PATCH',
        url: `/register/${userId}`,
        body: {
          username: username,
          new_username: newUsername,
          password: password,
        },
      });
    }
  }, [canUpdate, send, username, password, newUsername, userId]);

  return {
    usernameField,
    passwordField,
    newUsernameField,
    moveToField,
    canUpdate,
    update,
    request,
    loading,
    ...requestSuccessHandler,
  };
};

export default useChangeEmail;
