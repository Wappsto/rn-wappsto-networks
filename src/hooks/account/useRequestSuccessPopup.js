import { useState, useCallback, useEffect, useContext } from 'react';
import { NavigationContext } from 'react-navigation';

const useRequestSuccessPopup = (request) => {
  const navigation = useContext(NavigationContext);
  const [ successVisible, setSuccessVisible ] = useState(false);

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

  return { successVisible, hideSuccessPopup };
}

export default useRequestSuccessPopup;
