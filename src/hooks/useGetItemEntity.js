import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { makeEntitySelector, makeItemSelector } from 'wappsto-redux';

const useGetItemEntity = (itemName, itemType) => {
  const getItem = useMemo(makeItemSelector, []);
  const itemId = useSelector(state => getItem(state, itemName));
  const getEntity = useMemo(makeEntitySelector, []);
  const item = useSelector(state => getEntity(state, itemType, itemId));
  return item;
};

export default useGetItemEntity;
