import { useEffect, useMemo } from 'react';
import { config } from '../configureWappstoRedux';
import { makeItemSelector } from 'wappsto-redux/selectors/items';
import { makeStreamSelector } from 'wappsto-redux/selectors/stream';
import { useSelector } from 'react-redux';

const useAddNetworkStream = (iotNetworkListAdd, iotNetworkListRemove) => {
  const getStream = useMemo(makeStreamSelector, []);
  const stream = useSelector(state => getStream(state, config.stream && config.stream.name));
  const getItemAdd = useMemo(makeItemSelector, []);
  const getItemRemove = useMemo(makeItemSelector, []);
  const addToList = useSelector(state => getItemAdd(state, iotNetworkListAdd));
  const removeFromList = useSelector(state => getItemRemove(state, iotNetworkListRemove));

  // add network from stream
  useEffect(() => {
    const _handleNetworkAdd = (event) => {
      try{
        let data = JSON.parse(event.data);
        if (data.constructor !== Array) {
          data = [data];
        }
        data.forEach(message => {
          if(message.meta_object.type === 'network'){
            if(message.event === 'create'){
              addToList(message.meta_object.id);
            } else if(message.event === 'delete'){
              removeFromList(message.meta_object.id);
            }
          }
        })
      } catch(e){

      }
    }

    if(stream && stream.ws && addToList){
      stream.ws.addEventListener('message', _handleNetworkAdd);
    }
    return () => {
      if(stream && stream.ws && addToList){
        stream.ws.removeEventListener('message', _handleNetworkAdd);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stream, addToList]);
}

export default useAddNetworkStream;
