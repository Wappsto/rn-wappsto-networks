import React, { useState, useCallback, useEffect } from 'react';
import { StatusBar } from 'react-native';
import PopupButton from '../../../../components/PopupButton';
import { Modal } from 'react-native';
import theme from '../../../../theme/themeExport';
import SelectChoice from './SelectChoice';
import SearchBlufi from './SearchBlufi';
import DeviceWifiList from './DeviceWifiList';
import ConfigureWifi from './ConfigureWifi';
import SetupDevice from './SetupDevice';
import ClaimNetwork from './ClaimNetwork';
import useVisible from 'wappsto-blanket/hooks/useVisible';
import { iotNetworkListAdd } from '../../../../util/params';
import ConfirmAddManufacturerNetwork from './ConfirmAddManufacturerNetwork';
import BackHandlerView from './BackHandlerView';
import useAddNetwork from '../../../../hooks/setup/useAddNetwork';
import useWifiFields from '../../../../hooks/setup/blufi/useWifiFields';
import useInitBlufi from '../../../../hooks/setup/blufi/useInitBlufi';
import useConnectToDevice from '../../../../hooks/setup/blufi/useConnectToDevice';

const Content = React.memo(({ visible, hide, show }) => {
  const wifiFields = useWifiFields();
  const [ selectedDevice, setSelectedDevice ] = useState();
  const [ maoVisible, maoShow, maoHide ] = useVisible(false);
  const [ step, setStep ] = useState(0);
  const addNetworkHandler = useAddNetwork(iotNetworkListAdd, maoShow, maoHide);
  const connectToDevice = useConnectToDevice(selectedDevice);

  useInitBlufi();

  const { setAcceptedManufacturerAsOwner } = addNetworkHandler;

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
      connectToDevice.disconnect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, setAcceptedManufacturerAsOwner]);

  let Step = null;
  switch (step) {
    case 0:
      Step = SelectChoice;
      break;
    case 1:
      Step = ClaimNetwork;
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
      <StatusBar backgroundColor={theme.variables.statusBarBgLight} barStyle={theme.variables.statusBarColorDark} />
      <ConfirmAddManufacturerNetwork visible={maoVisible} accept={addNetworkHandler.acceptManufacturerAsOwner} reject={addNetworkHandler.refuseManufacturerAsOwner} />
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
              wifiFields={wifiFields}
              addNetworkHandler={addNetworkHandler}
              connectToDevice={connectToDevice}
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
