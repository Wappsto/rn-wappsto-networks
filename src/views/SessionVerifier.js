import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import {removeRequest} from 'wappsto-redux/actions/request';
import {addSession} from 'wappsto-redux/actions/session';
import useRequest from 'wappsto-blanket/hooks/useRequest';

const SessionVerifier = React.memo(({ status, session, navigate }) => {
  const cache = useRef({});
  const dispatch = useDispatch();
  const { request, send } = useRequest();

  const clearTimeouts = () => {
    clearTimeout(cache.current.minimumTimeout);
    clearTimeout(cache.current.maximumTimeout);
  }

  const navigateTo = (page) => {
    clearTimeouts();
    navigate(page);
  }

  const userLogged = (cRequest, cSession) => {
    dispatch(addSession(cSession.json));
    dispatch(removeRequest(cRequest.id));
    navigateTo('MainScreen');
  }

  const checkSession = () => {
    if (session) {
      const id = session.meta.id;
      send({
        method: 'GET',
        url: '/session/' + id,
        headers: {
          'x-session': id
        }
      });
    }
  }

  const addMinimumTimeout = () => {
    cache.current.minimumTimeout = setTimeout(() => {
      cache.current.timeoutEnded = true;
      if (status !== 'pending') {
        if (cache.current.sessionStatus === 'error') {
          navigateTo('LoginScreen');
        } else if (cache.current.sessionStatus === 'success') {
          navigateTo('MainScreen');
        }
      }
    }, 500);
  }

  const addMaximumTimeout = () => {
    cache.current.maximumTimeout = setTimeout(() => {
      cache.current.timeoutEnded = true;
      navigateTo('LoginScreen');
    }, 10000);
  }

  const verify = () => {
    if (!cache.current.done) {
      if (status === 'error') {
        cache.current.sessionStatus = 'error';
        if (cache.current.timeoutEnded) {
          navigateTo('LoginScreen');
        }
      }
      if (!request && session) {
        checkSession();
      }
      if (request) {
        cache.current.sessionStatus = request.status;
        if (request.status === 'success') {
          if (cache.current.timeoutEnded && !cache.current.done) {
            cache.current.done = true;
            userLogged(request, session);
          }
        } else if (request.status === 'error') {
          navigateTo('LoginScreen');
        }
      }
    }
  }

  useEffect(() => {
    verify();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, status, request]);

  useEffect(() => {
    addMinimumTimeout();
    addMaximumTimeout();
    return () => {
      clearTimeouts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return null;
});

export default SessionVerifier;
