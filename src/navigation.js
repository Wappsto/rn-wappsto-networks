import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { getSession } from 'wappsto-redux';
import './getImages';
import useStorageSession from './hooks/useStorageSession';
import SessionVerifier from './views/SessionVerifier';
import { screenComponents } from './views/screenComponents';
import LoginStack from './views/login/LoginStack';
import DrawerNavigator from './views/DrawerNavigator';

const Router = React.memo(() => {
  const { session: storageSession, status } = useStorageSession();
  const [isValidSession, setIsValidSession] = useState('pending');
  const session = useSelector(getSession);
  const [ready, setReady] = useState(false);

  const handleCachedSession = isValid => {
    if (!isValid) {
      setIsValidSession('error');
    }
  };

  useMemo(() => {
    if (session && session.valid !== false) {
      setIsValidSession('success');
    } else if (isValidSession !== 'pending') {
      setIsValidSession('error');
    }
  }, [session, isValidSession]);

  const wait = async () => {
    try {
      if (screenComponents.SplashScreen.load) {
        await screenComponents.SplashScreen.load();
      }
    } catch (e) {}
    setReady(true);
  };

  useEffect(() => {
    wait();
  }, []);

  switch (isValidSession) {
    case 'success':
      return (
        <>
          <DrawerNavigator />
        </>
      );
    case 'error':
      return <LoginStack />;
    case 'pending':
      return (
        <>
          <screenComponents.SplashScreen />
          {ready && (
            <SessionVerifier
              status={status}
              session={storageSession}
              onResult={handleCachedSession}
            />
          )}
        </>
      );
    default:
      return null;
  }
});

Router.displayName = 'Router';
export default Router;
