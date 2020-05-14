import { useEffect, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setItem } from 'wappsto-redux/actions/items';
import { closeStream } from 'wappsto-redux/actions/stream';
import { removeSession } from 'wappsto-redux/actions/session';
import { getUserData } from 'wappsto-redux/selectors/entities';
import { getSession } from 'wappsto-redux/selectors/session';
import { makeItemSelector } from 'wappsto-redux/selectors/items';
import useRequest from 'wappsto-blanket/hooks/useRequest';
import { config } from '../configureWappstoRedux';
import { userFetched, userGetRequest } from '../util/params';
import AsyncStorage from '@react-native-community/async-storage';

const useUser = (navigation) => {
  const dispatch = useDispatch();
  const session = useSelector(getSession);
  const user = useSelector(getUserData);
  const { request, requestId, send } = useRequest();
  const { send: sendDelete } = useRequest();
  const getItem = useMemo(makeItemSelector, []);
  const fetched = useSelector(state => getItem(state, userFetched));

  const getUser = useCallback(() => {
    send({
      method: 'GET',
      url: '/user',
      query: {
        me: true,
        expand: 0
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!fetched) {
      dispatch(setItem(userFetched, true));
      getUser();
    } else if (request && request.status === 'error') {
      getUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    dispatch(setItem(userGetRequest, requestId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestId]);

  const logout = useCallback(() => {
    if (config.stream) {
      dispatch(closeStream(config.stream.name));
    }
    sendDelete({ method: 'DELETE', url: '/session/' + session.meta.id });
    dispatch(removeSession());
    AsyncStorage.removeItem('session');
    navigation.navigate('LoginScreen');
  }, [navigation, sendDelete, session.meta.id, dispatch]);

  let name = '';
  if (user) {
    if (user.nickname) {
      name = user.nickname;
    } else {
      if (user.first_name) {
        name += user.first_name + ' ';
      }
      if (user.last_name) {
        name += user.last_name;
      }

      if (!name) {
        if (user.provider[0] && user.provider[0].name) {
          name = user.provider[0].name;
        } else {
          name = user.email;
        }
      }
    }
  }

  return { user, name, logout, request, session };
}

export default useUser;
