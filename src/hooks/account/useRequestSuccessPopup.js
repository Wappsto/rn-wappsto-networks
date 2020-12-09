import { useState, useCallback, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

const useRequestSuccessPopup = (request) => {
  const navigation = useNavigation();
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
