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
import useVisible from 'wappsto-blanket/hooks/useVisible';
import { removeRequest } from 'wappsto-redux/actions/request';
import { makeItemSelector } from 'wappsto-redux/selectors/items';
import { useSelector, useDispatch } from 'react-redux';
import { manufacturerAsOwnerErrorCode, iotNetworkListAdd } from '@/util/params';
import Popup from '@/components/Popup';
import ConfirmAddManufacturerNetwork from './ConfirmAddManufacturerNetwork';
import BackHandlerView from './BackHandlerView';

const skipCodes = [manufacturerAsOwnerErrorCode];
const Content = React.memo(({ visible, hide, show }) => {
  const dispatch = useDispatch();
  const [ ssid, setSsid ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ selectedDevice, setSelectedDevice ] = useState();
  const [ maoVisible, maoShow, maoHide ] = useVisible(false);
  const [ step, setStep ] = useState(0);
  const { request, send } = useRequest();
  const [ networkId, setNetworkId ] = useState();
  const [ acceptedManufacturerAsOwner, setAcceptedManufacturerAsOwner ] = useState(true);
  const getItem = useMemo(makeItemSelector, []);
  const addToList = useSelector(state => getItem(state, iotNetworkListAdd));

  const next = useCallback(() => {
    setStep(s => {
      if(s === 3){
        setAcceptedManufacturerAsOwner(true);
      }
      return s + 1;
    });
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
      setAcceptedManufacturerAsOwner(true);
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
        addToList(request.json && request.json.meta.id);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [request]);

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
    <>
      <Popup visible={maoVisible} onRequestClose={refuseManufacturerAsOwner} hide={refuseManufacturerAsOwner} hideC>
        <ConfirmAddManufacturerNetwork
          accept={acceptManufacturerAsOwner}
          reject={maoHide}
        />
      </Popup>
      <Modal
        transparent={true}
        visible={visible}
        hide={hide}
        onRequestClose={handleBack}>
          <BackHandlerView hide={hide} handleBack={handleBack}>
            <Step
              hide={hide}
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
              acceptedManufacturerAsOwner={acceptedManufacturerAsOwner}
              />
          </BackHandlerView>
      </Modal>
    </>
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
