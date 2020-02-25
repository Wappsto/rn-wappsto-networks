import { useCallback } from 'react';
import { removeItem } from 'wappsto-redux/actions/items';
import { useDispatch } from 'react-redux';

const useClearNetworkChilds = () => {
  const dispatch = useDispatch();
  return useCallback((items) => {
    items.forEach(network => {
      network.device.forEach(deviceId => {
        dispatch(removeItem('/device/' + deviceId + '/value_ids'));
        dispatch(removeItem('/device/' + deviceId + '/value_fetched'));
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

export default useClearNetworkChilds;
