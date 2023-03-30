import { useState, useCallback, useEffect, useMemo } from 'react';
import { useRequest } from 'wappsto-blanket';
import { makeItemSelector } from 'wappsto-redux';
import { useSelector } from 'react-redux';
import { manufacturerAsOwnerErrorCode } from '../../util/params';

const skipErrorCodes = [manufacturerAsOwnerErrorCode];
const useAddNetwork = (iotNetworkListAdd, maoShow, maoHide, autoAccept = null) => {
  const { request, send, removeRequest } = useRequest();
  const [networkId, setNetworkId] = useState();
  const [body, setBody] = useState({});
  const [acceptedManufacturerAsOwner, setAcceptedManufacturerAsOwner] = useState(autoAccept);
  const getItem = useMemo(makeItemSelector, []);

  const addToList = useSelector(state => getItem(state, iotNetworkListAdd));

  const sendR = useCallback(
    (id, b = {}) => {
      if (!id) {
        id = networkId;
        b = body;
      }
      if (id) {
        send({
          method: 'POST',
          url: '/network/' + id,
          query: {
            verbose: true,
          },
          body: b,
        });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [networkId, body],
  );

  const sendRequest = useCallback(
    (id, body = {}) => {
      let b = { ...body };
      if (acceptedManufacturerAsOwner) {
        b = {
          ...b,
          meta: {
            accept_manufacturer_as_owner: true,
          },
        };
      }
      if (id) {
        setNetworkId(id);
        setBody(b);
      }
      sendR(id, b);
    },
    [sendR, acceptedManufacturerAsOwner],
  );

  const acceptManufacturerAsOwner = useCallback(() => {
    setAcceptedManufacturerAsOwner(true);
    maoHide();
    const b = {
      ...body,
      meta: {
        accept_manufacturer_as_owner: true,
      },
    };
    setBody(b);
    sendR(networkId, b);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [networkId, body]);

  const refuseManufacturerAsOwner = useCallback(() => {
    setAcceptedManufacturerAsOwner(false);
    maoHide();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (request) {
      if (
        request.status === 'error' &&
        request.json &&
        request.json.code === manufacturerAsOwnerErrorCode
      ) {
        maoShow();
      } else if (request.status === 'success') {
        removeRequest();
        setAcceptedManufacturerAsOwner(autoAccept);
        if (addToList) {
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
    skipErrorCodes,
    removeRequest,
  };
};

export default useAddNetwork;
