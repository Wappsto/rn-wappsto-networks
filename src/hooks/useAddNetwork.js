import { useState, useEffect, useCallback } from 'react';
import { isUUID } from 'wappsto-redux/util/helpers';
import { manufacturerAsOwnerErrorCode } from '../util/params';

const useAddNetwork = (sendRequest, postRequest, acceptedManufacturerAsOwner, onDone) => {
  const [ inputValue, setInputValue ] = useState('');
  const [ isScanning, setIsScanning ] = useState(false);
  const [ didScan, setDidScan ] = useState(false);
  const [ loading, setLoading ] = useState(false);

  const onRead = useCallback(event => {
    const qrText = (event.data.split('+')[0] || '').trim();
    setInputValue(qrText);
    setIsScanning(false);
    setDidScan(true);
  }, []);

  const addNetwork = useCallback(() => {
    setLoading(true);
    sendRequest(inputValue);
  }, [sendRequest, inputValue]);

  const switchView = useCallback(() => {
    setIsScanning(v => !v);
  }, []);

  const onSubmitEditing = useCallback(() => {
    if(isUUID(inputValue)){
      addNetwork();
    }
  }, [inputValue, addNetwork]);

  useEffect(() => {
    if(postRequest){
      if(postRequest.status === 'success'){
        if(onDone){
          onDone();
        }
      } else if(postRequest.status !== 'pending' && (postRequest.status !== 'error' || postRequest.json.code !== manufacturerAsOwnerErrorCode)){
        setLoading(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postRequest]);

  useEffect(() => {
    if(acceptedManufacturerAsOwner === false){
      setLoading(false);
    }
  }, [acceptedManufacturerAsOwner]);

  return {
    inputValue,
    setInputValue,
    switchView,
    isScanning,
    didScan,
    onRead,
    onSubmitEditing,
    addNetwork,
    loading,
    canAdd: isUUID(inputValue) && !loading
  };
}

export default useAddNetwork;
