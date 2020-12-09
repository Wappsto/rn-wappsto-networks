import { useEffect, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useList from 'wappsto-blanket/hooks/useList';
import { setItem } from 'wappsto-redux/actions/items';
import { removeItem as removeStoreItem } from 'wappsto-redux/actions/items';
import { makeStreamSelector } from 'wappsto-redux/selectors/stream';
import { makeItemSelector } from 'wappsto-redux/selectors/items';
import { config } from '../configureWappstoRedux';
import { currentPage } from '../util/params';
import schemas from 'wappsto-redux/util/schemas';
import useAppState from './useAppState';
import { useRoute } from '@react-navigation/native';

const usePageList = (name, url, query, addItemName, removeItemName) => {
  const dispatch = useDispatch();
  const getStream = useMemo(makeStreamSelector, []);
  const stream = useSelector(state => getStream(state, config.stream && config.stream.name));
  const { items, request, refresh, loadMore, canLoadMore, addItem, removeItem } = useList({ name, url, query, resetOnEmpty: true });
  const getItem = useMemo(makeItemSelector, []);
  const currPage = useSelector(state => getItem(state, currentPage));
  const route = useRoute();
  const page = route.name;

  useEffect(() => {
    if(addItemName){
      dispatch(setItem(addItemName, () => addItem));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addItemName, addItem]);

  useEffect(() => {
    if(removeItemName){
      dispatch(setItem(removeItemName, () => removeItem));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [removeItemName, removeItem]);

  const refreshList = useCallback(() => {
    // clear child list
    items.forEach(item => {
      const schema = schemas.getSchemaTree(item.meta.type);
      if(schema && schema.dependencies){
        schema.dependencies.forEach(({ key, type }) => {
          if(type === 'many'){
            dispatch(removeStoreItem(`/${item.meta.type}/${item.meta.id}/${key}_ids`));
            dispatch(removeStoreItem(`/${item.meta.type}/${item.meta.id}/${key}_fetched`));
            const childSchema = schemas.getSchemaTree(key);
            childSchema.dependencies.forEach(({ key: cKey, type: cType }) => {
              if(cType === 'many'){
                item[key].forEach(childId => {
                  dispatch(removeStoreItem(`/${key}/${childId}/${cKey}_ids`));
                  dispatch(removeStoreItem(`/${key}/${childId}/${cKey}_fetched`));
                });
              }
            });
          }
        });
      }
    });
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  useAppState(
    useCallback(() => {
      if (stream && stream.ws && stream.ws.readyState === stream.ws.CLOSED) {
        refresh(currPage === page);
      }
    }, [stream, currPage, refresh, page])
  );

  return { items, request, refresh: refreshList, canLoadMore, loadMore };
}

export default usePageList;
