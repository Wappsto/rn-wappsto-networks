import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { addSession } from 'wappsto-redux';
import { useRequest } from 'wappsto-blanket';

const SessionVerifier = React.memo(({ status, session, onResult }) => {
  const cache = useRef({});
  const dispatch = useDispatch();
  const { request, send, removeRequest } = useRequest();

  const clearTimeouts = () => {
    clearTimeout(cache.current.minimumTimeout);
    clearTimeout(cache.current.maximumTimeout);
  };

  const sendResult = isValid => {
    clearTimeouts();
    onResult(isValid);
  };

  const userLogged = () => {
    dispatch(addSession(session));
    removeRequest();
    sendResult(true);
  };

  const checkSession = () => {
    if (session) {
      const id = session.meta.id;
      send({
        method: 'GET',
        url: '/session/' + id,
        headers: {
          'x-session': id,
        },
      });
    }
  };

  const addMinimumTimeout = () => {
    cache.current.minimumTimeout = setTimeout(() => {
      cache.current.timeoutEnded = true;
      if (status !== 'pending') {
        if (cache.current.sessionStatus === 'error') {
          sendResult(false);
        } else if (cache.current.sessionStatus === 'success') {
          userLogged();
        }
      }
    }, 500);
  };

  const addMaximumTimeout = () => {
    cache.current.maximumTimeout = setTimeout(() => {
      cache.current.timeoutEnded = true;
      sendResult(false);
    }, 10000);
  };

  const verify = () => {
    if (!cache.current.done) {
      if (status === 'error') {
        cache.current.sessionStatus = 'error';
        if (cache.current.timeoutEnded) {
          sendResult(false);
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
            userLogged();
          }
        } else if (request.status === 'error') {
          sendResult(false);
        }
      }
    }
  };

  useEffect(() => {
    verify();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, status, request]);

  useEffect(() => {
    addMinimumTimeout();
    addMaximumTimeout();
    return () => {
      clearTimeouts();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return null;
});

export default SessionVerifier;
