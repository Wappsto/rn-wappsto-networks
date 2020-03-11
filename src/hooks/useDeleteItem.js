import { useCallback } from 'react';
import useRequest from 'wappsto-blanket/hooks/useRequest';

const useDeleteItem = (item) => {
  const { request, send } = useRequest();

  const deleteItem = useCallback(() => {
    if(item && item.meta){
      send({
        method: 'DELETE',
        url: `/${item.meta.type}/${item.meta.id}`
      });
    }
  }, [item, send]);

  return { deleteItem, request };
}

export default useDeleteItem;
