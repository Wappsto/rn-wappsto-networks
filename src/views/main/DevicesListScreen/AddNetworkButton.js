import React, {PureComponent} from 'react';
import PopupButton from '../../../components/PopupButton';
import Popup from '../../../components/Popup';
import NetworkRequestWrapper from './NetworkRequestWrapper';
import AddNetworkPopup from './AddNetworkPopup';
import ConfirmAddManufacturerNetwork from './ConfirmAddManufacturerNetwork';
import theme from '../../../theme/themeExport';

export default class AddNetworkButton extends PureComponent {
  state = {
    manufacturerAsOwnerError: false,
  };

  content = (visible, hide, show) => {
    const customHide = manufacturerAsOwnerError => {
      hide();
      if (manufacturerAsOwnerError) {
        this.setState({manufacturerAsOwnerError}, show);
      }
    };
    const confirmHide = () => {
      hide();
      this.setState({manufacturerAsOwnerError: false});
    };
    if (this.state.manufacturerAsOwnerError) {
      return (
        <Popup visible={visible} onRequestClose={confirmHide} hide={confirmHide}>
          <NetworkRequestWrapper hide={confirmHide}>
            {(sendRequest, props) => (
              <ConfirmAddManufacturerNetwork
                sendRequest={sendRequest}
                postRequest={props.postRequest}
                networkId={props.networkId}
              />
            )}
          </NetworkRequestWrapper>
        </Popup>
      );
    }
    return (
      <Popup visible={visible} onRequestClose={hide} hide={hide}>
        <NetworkRequestWrapper hide={customHide}>
          {(sendRequest, props) => (
            <AddNetworkPopup
              sendRequest={sendRequest}
              postRequest={props.postRequest}
              setItem={props.setItem}
            />
          )}
        </NetworkRequestWrapper>
      </Popup>
    );
  };
  render() {
    return (
      <PopupButton icon="plus-circle" color={theme.variables.white}>
        {this.content}
      </PopupButton>
    );
  }
}
