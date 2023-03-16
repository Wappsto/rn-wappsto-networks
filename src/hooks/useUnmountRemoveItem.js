import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { removeItem } from 'wappsto-redux/actions/items';

const useUnmountRemoveItem = (itemName) => {
  const dispatch = useDispatch();
  useEffect(() => {
    return () => {
      dispatch(removeItem(itemName));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export default useUnmountRemoveItem;
