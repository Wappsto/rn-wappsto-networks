import React, { useState, useCallback, useEffect, useMemo } from 'react';
import PopupButton from '@/components/PopupButton';
import { Modal } from 'react-native';
import theme from '@/theme/themeExport';
import SelectChoice from './SelectChoice';
import SearchBlufi from './SearchBlufi';
import ConfigureWifi from './ConfigureWifi';
import SetupDevice from './SetupDevice';
import AddNetworkPopup from './AddNetworkPopup';
import useRequest from 'wappsto-blanket/hooks/useRequest';
import { makeItemSelector } from 'wappsto-redux/selectors/items';
import { useSelector } from 'react-redux';
import { manufacturerAsOwnerErrorCode, iotNetworkListAdd } from '@/util/params';
import Popup from '@/components/Popup';
import ConfirmAddManufacturerNetwork from './ConfirmAddManufacturerNetwork';
import BackHandlerView from './BackHandlerView';

const skipCodes = [manufacturerAsOwnerErrorCode];
const Content = React.memo(({ visible, hide, show }) => {
  const [ ssid, setSsid ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ selectedDevice, setSelectedDevice ] = useState();
  const [ step, setStep ] = useState(0);
  const { request, send } = useRequest();
  const [ networkId, setNetworkId ] = useState();
  const [ manufacturerAsOwnerError, setManufacturerAsOwnerError ] = useState(false);
  const getItem = useMemo(makeItemSelector, []);
  const addToList = useSelector(state => getItem(state, iotNetworkListAdd));

  const next = useCallback(() => {
    setStep(s => s + 1);
  }, []);

  const handleBack = useCallback(() => {
    if (step) {
      setStep(n => n === 2 ? 0 : n - 1);
    } else {
      hide();
    }
  }, [step, setStep, hide]);

  useEffect(() => {
    if(!visible){
      setStep(0);
    }
  }, [visible]);

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

  useEffect(() => {
    if(request){
      if(request.status === 'error' && request.json.code === manufacturerAsOwnerErrorCode){
        hide();
        setManufacturerAsOwnerError(true);
      } else if(request.status === 'success'){
        hide();
        setManufacturerAsOwnerError(false);
        addToList(request.json && request.json.meta.id);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [request]);

  useEffect(() => {
    if(manufacturerAsOwnerError){
      show();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manufacturerAsOwnerError]);

  if (manufacturerAsOwnerError) {
    return (
      <Popup visible={visible} onRequestClose={hide} hide={hide}>
        <ConfirmAddManufacturerNetwork
          acceptManufacturerAsOwner={acceptManufacturerAsOwner}
          postRequest={request}
          networkId={networkId}
        />
      </Popup>
    );
  }

  let Step = null;
  switch (step) {
    case 0:
      Step = SelectChoice;
      break;
    case 1:
      Step = AddNetworkPopup;
      break;
    case 2:
      Step = SearchBlufi;
      break;
    case 3:
      Step = ConfigureWifi;
      break;
    case 4:
      Step = SetupDevice;
      break;
    default:
      Step = null;
      break;
  }

  return (
    <Modal
      transparent={true}
      visible={visible}
      hide={hide}
      onRequestClose={handleBack}>
        <BackHandlerView hide={hide} handleBack={handleBack}>
          <Step
            next={next}
            setStep={setStep}
            selectedDevice={selectedDevice}
            setSelectedDevice={setSelectedDevice}
            ssid={ssid}
            setSsid={setSsid}
            password={password}
            setPassword={setPassword}
            sendRequest={sendRequest}
            postRequest={request}
            skipCodes={skipCodes}
            />
        </BackHandlerView>
    </Modal>
  );
});

const AddNetwork = React.memo(() => {
  return (
    <PopupButton icon='plus-circle' color={theme.variables.white}>
      {(visible, hide, show) => <Content visible={visible} hide={hide} show={show} />}
    </PopupButton>
  );
});

export default AddNetwork;
