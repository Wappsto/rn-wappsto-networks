import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import useRequest from 'wappsto-blanket/hooks/useRequest';
import useVisible from 'wappsto-blanket/hooks/useVisible';
import { setItem } from 'wappsto-redux/actions/items';
import { itemDelete } from '../util/params';

const useDeleteItem = (item) => {
  const dispatch = useDispatch();
  const [ confirmVisible, showDeleteConfirmation, hideDeleteConfirmation ] = useVisible(false);
  const { request, send } = useRequest();
  let type , id;
  if(item && item.meta){
    type = item.meta.type;
    id = item.meta.id;
  }

  const deleteItem = useCallback(() => {
    hideDeleteConfirmation();
    if(type && id){
      const requestId = send({
        method: 'DELETE',
        url: `/${type}/${id}`
      });
      dispatch(setItem(itemDelete + id, requestId));
    }
  }, [type, id, send, hideDeleteConfirmation, dispatch]);

  return { deleteItem, request, confirmVisible, showDeleteConfirmation, hideDeleteConfirmation };
}

export default useDeleteItem;
