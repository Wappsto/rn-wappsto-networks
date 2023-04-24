import { useCallback, useEffect, useState } from 'react';
import Str from '../../helpers/stringHelpers';
import { manufacturerAsOwnerErrorCode } from '../../util/params';

const useAddNetworkForm = (addNetworkHandler, onDone) => {
  const { sendRequest, request, acceptedManufacturerAsOwner, removeRequest } = addNetworkHandler;
  const [inputValue, setInputValue] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [didScan, setDidScan] = useState(false);
  const [scanError, setScanError] = useState(false);
  const [loading, setLoading] = useState(false);

  const canAdd = Str.isUuid(inputValue) && !loading;

  const onRead = useCallback(str => {
    const uuids = str.match(Str.uuidCaptureRegex);
    if (!uuids || uuids.length === 0) {
      setScanError('noUUID');
      setInputValue('');
    } else {
      setInputValue(uuids[0]);
    }
    setIsScanning(false);
    setDidScan(true);
  }, []);

  const addNetwork = useCallback(() => {
    setLoading(true);
    sendRequest(inputValue);
  }, [sendRequest, inputValue]);

  const switchView = useCallback(() => {
    setIsScanning(v => {
      if (!v) {
        setScanError();
      }
      return !v;
    });
  }, []);

  const onSubmitEditing = useCallback(() => {
    if (Str.isUuid(inputValue)) {
      addNetwork();
    }
  }, [inputValue, addNetwork]);

  useEffect(() => {
    if (request) {
      if (request.status === 'success') {
        if (onDone) {
          onDone(inputValue);
        }
      } else if (
        request.status !== 'pending' &&
        (request.status !== 'error' || request.json?.code !== manufacturerAsOwnerErrorCode)
      ) {
        setLoading(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [request]);

  useEffect(() => {
    if (acceptedManufacturerAsOwner === false) {
      setLoading(false);
    }
  }, [acceptedManufacturerAsOwner]);

  useEffect(() => {
    removeRequest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    inputValue,
    setInputValue,
    switchView,
    isScanning,
    didScan,
    scanError,
    onRead,
    onSubmitEditing,
    addNetwork,
    loading,
    canAdd,
  };
};

export default useAddNetworkForm;
