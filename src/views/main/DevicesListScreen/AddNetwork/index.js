import React, { useState, useCallback, useEffect } from 'react';
import PopupButton from '../../../../components/PopupButton';
import { Modal, NativeModules, NativeEventEmitter } from 'react-native';
import theme from '../../../../theme/themeExport';
import SelectChoice from './SelectChoice';
import SearchBlufi from './SearchBlufi';
import DeviceWifiList from './DeviceWifiList';
import ConfigureWifi from './ConfigureWifi';
import SetupDevice from './SetupDevice';
import AddNetworkPopup from './AddNetworkPopup';
import useVisible from 'wappsto-blanket/hooks/useVisible';
import { iotNetworkListAdd } from '../../../../util/params';
import ConfirmAddManufacturerNetwork from './ConfirmAddManufacturerNetwork';
import BackHandlerView from './BackHandlerView';
import useAddNetwork from '../../../../hooks/setup/useAddNetwork';
import BleManager from 'react-native-ble-manager';
import Blufi from '../../../../BlufiLib';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const Content = React.memo(({ visible, hide, show }) => {
  const [ ssid, setSsid ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ selectedDevice, setSelectedDevice ] = useState();
  const [ maoVisible, maoShow, maoHide ] = useVisible(false);
  const [ step, setStep ] = useState(0);
  const {
    setAcceptedManufacturerAsOwner,
    sendRequest,
    request,
    acceptManufacturerAsOwner,
    refuseManufacturerAsOwner,
    acceptedManufacturerAsOwner,
    skipErrorCodes
  } = useAddNetwork(iotNetworkListAdd, maoShow, maoHide);

  const disconnectAndHide = useCallback(() => {
    if(selectedDevice){
      BleManager.disconnect(selectedDevice.id);
    }
    Blufi.reset();
    hide();
  }, [selectedDevice, hide]);

  const next = useCallback(() => {
    setStep(s => {
      if(s === 3){
        setAcceptedManufacturerAsOwner(null);
      }
      return s + 1;
    });
  }, [setAcceptedManufacturerAsOwner]);

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
      setAcceptedManufacturerAsOwner(null);
    }
  }, [visible, setAcceptedManufacturerAsOwner]);

  useEffect(() => {
    bleManagerEmitter.addListener('BleManagerDisconnectPeripheral', Blufi.reset);
    return () => {
      bleManagerEmitter.removeListener('BleManagerDisconnectPeripheral', Blufi.reset);
    }
  }, []);

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
      Step = DeviceWifiList;
      break;
    case 4:
      Step = ConfigureWifi;
      break;
    case 5:
      Step = SetupDevice;
      break;
    default:
      Step = null;
      break;
  }

  return (
    <>
      <ConfirmAddManufacturerNetwork visible={maoVisible} accept={acceptManufacturerAsOwner} reject={refuseManufacturerAsOwner} />
      <Modal
        transparent={true}
        visible={visible}
        hide={disconnectAndHide}
        onRequestClose={handleBack}>
          <BackHandlerView hide={disconnectAndHide} handleBack={handleBack}>
            <Step
              hide={disconnectAndHide}
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
              skipCodes={skipErrorCodes}
              acceptedManufacturerAsOwner={acceptedManufacturerAsOwner}
              />
          </BackHandlerView>
      </Modal>
    </>
  );
});

const AddNetwork = React.memo(() => {
  return (
    <PopupButton icon='plus-circle' style={theme.common.headerButton} color={theme.variables.headerColor}>
      {(visible, hide, show) => <Content visible={visible} hide={hide} show={show} />}
    </PopupButton>
  );
});

export default AddNetwork;
