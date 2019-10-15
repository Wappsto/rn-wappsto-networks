import React, {PureComponent} from 'react';
import PopupButton from '../../../components/PopupButton';
import Popup from '../../../components/Popup';
import AddNetworkPopup from './AddNetworkPopup';
import theme from '../../../theme/themeExport';

export default class AddNetworkButton extends PureComponent {
  content = (visible, hide) => {
    return (
      <Popup visible={visible} onRequestClose={hide} hide={hide}>
        <AddNetworkPopup hide={hide} />
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
