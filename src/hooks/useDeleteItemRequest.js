import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { makeItemSelector, makeRequestSelector } from 'wappsto-redux';
import { itemDelete } from '../util/params';

const useDeleteItemRequest = item => {
  const getItem = useMemo(makeItemSelector, []);
  const getRequest = useMemo(makeRequestSelector, []);
  const requestId = useSelector(state => {
    if (item && item.meta) {
      return getItem(state, itemDelete + item.meta.id);
    }
    return null;
  });
  const request = useSelector(state => {
    if (requestId) {
      return getRequest(state, requestId);
    }
    return null;
  });
  return request;
};

export default useDeleteItemRequest;
