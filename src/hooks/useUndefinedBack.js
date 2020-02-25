import { useEffect } from 'react';

const useUndefinedBack = (item, navigation) => {
  useEffect(() => {
    if(!item || !item.meta || !item.meta.id){
      navigation.goBack();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item]);
}

export default useUndefinedBack;
