import React, {PureComponent} from 'react';
import PopupButton from '../../../components/PopupButton';
import Popup from '../../../components/Popup';
import NetworkRequestWrapper from './NetworkRequestWrapper';
import AddNetworkPopup from './AddNetworkPopup';
import ConfirmAddManufacturerNetwork from './ConfirmAddManufacturerNetwork';
import theme from '../../../theme/themeExport';

export default class AddNetworkButton extends PureComponent {
  state = {
    manufacturerAsUserError: false,
  };

  content = (visible, hide, show) => {
    const customHide = manufacturerAsUserError => {
      hide();
      if (manufacturerAsUserError) {
        this.setState({manufacturerAsUserError}, show);
      }
    };
    if (this.state.manufacturerAsUserError) {
      return (
        <Popup visible={visible} onRequestClose={hide} hide={hide}>
          <NetworkRequestWrapper hide={hide}>
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
