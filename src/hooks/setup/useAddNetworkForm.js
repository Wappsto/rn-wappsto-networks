import { useState, useEffect, useCallback } from 'react';
import { isUUID, UUIDRegex } from 'wappsto-redux/util/helpers';
import { manufacturerAsOwnerErrorCode } from '../../util/params';

const useAddNetworkForm = (addNetworkHandler, onDone) => {
  const { sendRequest, request, acceptedManufacturerAsOwner, removeRequest } = addNetworkHandler;
  const [ inputValue, setInputValue ] = useState('');
  const [ isScanning, setIsScanning ] = useState(false);
  const [ didScan, setDidScan ] = useState(false);
  const [ scanError, setScanError ] = useState(false);
  const [ loading, setLoading ] = useState(false);

  const canAdd = isUUID(inputValue) && !loading;

  const onRead = useCallback(event => {
    const uuids = event.data.match(new RegExp(UUIDRegex, 'gi'));
    if(!uuids || uuids.length === 0){
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
      if(!v){
        setScanError();
      }
      return !v;
    });
  }, []);

  const onSubmitEditing = useCallback(() => {
    if(isUUID(inputValue)){
      addNetwork();
    }
  }, [inputValue, addNetwork]);

  useEffect(() => {
    if(request){
      if(request.status === 'success'){
        if(onDone){
          onDone();
        }
      } else if(request.status !== 'pending' && (request.status !== 'error' || request.json.code !== manufacturerAsOwnerErrorCode)){
        setLoading(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [request]);

  useEffect(() => {
    if(acceptedManufacturerAsOwner === false){
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
    canAdd
  };
}

export default useAddNetworkForm;
