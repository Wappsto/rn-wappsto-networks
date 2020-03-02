import { useState, useCallback, useEffect, useMemo } from 'react';
import useRequest from 'wappsto-blanket/hooks/useRequest';
import { removeRequest } from 'wappsto-redux/actions/request';
import { makeItemSelector } from 'wappsto-redux/selectors/items';
import { useSelector, useDispatch } from 'react-redux';
import { manufacturerAsOwnerErrorCode } from 'src/util/params';

const skipErrorCodes = [manufacturerAsOwnerErrorCode];
const useAddNetworkAsManufacturer = (iotNetworkListAdd, maoShow, maoHide) => {
  const { request, send } = useRequest();
  const [ networkId, setNetworkId ] = useState();
  const [ acceptedManufacturerAsOwner, setAcceptedManufacturerAsOwner ] = useState(true);
  const getItem = useMemo(makeItemSelector, []);
  const dispatch = useDispatch();

  const addToList = useSelector(state => getItem(state, iotNetworkListAdd));
  const sendRequest = useCallback((id, body = {}) => {
    setNetworkId(id);
    send({
      method: 'POST',
      url: '/network/' + id,
      query: {
        verbose: true
      },
      body
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const acceptManufacturerAsOwner = useCallback(() => {
    setAcceptedManufacturerAsOwner(true);
    maoHide();
    send({
      method: 'POST',
      url: '/network/' + networkId,
      query: {
        verbose: true
      },
      body: {
        meta: {
          accept_manufacturer_as_owner: true
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [networkId]);

  const refuseManufacturerAsOwner = useCallback(() => {
    setAcceptedManufacturerAsOwner(false);
    maoHide();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if(request){
      if(request.status === 'error' && request.json.code === manufacturerAsOwnerErrorCode){
        maoShow();
      } else if(request.status === 'success'){
        dispatch(removeRequest(request.id));
        if(addToList){
          addToList(request.json && request.json.meta.id);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [request]);

  return {
    setAcceptedManufacturerAsOwner,
    sendRequest,
    request,
    acceptManufacturerAsOwner,
    refuseManufacturerAsOwner,
    acceptedManufacturerAsOwner,
    skipErrorCodes
  };
}

export default useAddNetworkAsManufacturer;
