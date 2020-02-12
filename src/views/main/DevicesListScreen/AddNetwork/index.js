import React, { useState, useCallback, useEffect } from 'react';
import PopupButton from '@/components/PopupButton';
import { Modal, StatusBar } from 'react-native';
import { SafeAreaView} from 'react-native-safe-area-context';
import theme from '@/theme/themeExport';
import SelectChoice from './SelectChoice';
import SearchBlufi from './SearchBlufi';
import ConfigureWifi from './ConfigureWifi';
import SetupDevice from './SetupDevice';
import AddNetworkPopup from './AddNetworkPopup';

const Content = React.memo(({ visible, hide, show }) => {
  const [ ssid, setSsid ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ selectedDevice, setSelectedDevice ] = useState();
  const [ step, setStep ] = useState(0);
  const next = useCallback(() => {
    setStep(s => s + 1);
  }, []);
  const previous = useCallback(() => {
    setStep(s => s - 1);
  }, []);

  useEffect(() => {
    if(!visible){
      setStep(0);
    }
  }, [visible]);

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
      onRequestClose={hide}>
        <SafeAreaView style={{flex: 1, backgroundColor: theme.variables.white}}>
          <StatusBar backgroundColor={theme.variables.white} barStyle='dark-content' />
          <Step
            next={next}
            previous={previous}
            hide={hide}
            setStep={setStep}
            selectedDevice={selectedDevice}
            setSelectedDevice={setSelectedDevice}
            ssid={ssid}
            setSsid={setSsid}
            password={password}
            setPassword={setPassword}
            />
        </SafeAreaView>
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
