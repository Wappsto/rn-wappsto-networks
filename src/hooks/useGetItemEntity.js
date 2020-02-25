import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { makeEntitySelector } from 'wappsto-redux/selectors/entities';
import { makeItemSelector } from 'wappsto-redux/selectors/items';

const useGetItemEntity = (itemName, itemType) => {
  const getItem = useMemo(makeItemSelector, []);
  const itemId = useSelector(state => getItem(state, itemName));
  const getEntity = useMemo(makeEntitySelector, []);
  const item = useSelector(state => getEntity(state, itemType, itemId));
  return item;
}

export default useGetItemEntity;
