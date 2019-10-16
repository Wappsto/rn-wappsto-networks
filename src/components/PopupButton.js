import React, {PureComponent, Fragment} from 'react';
import {TouchableOpacity} from 'react-native';

import theme from '../theme/themeExport';
import Icon from 'react-native-vector-icons/Feather';

export default class PopupButton extends PureComponent {
  state = {
    modalVisible: false,
  };

  showPopup = () => {
    this.setState({modalVisible: true});
  };

  hidePopup = () => {
    this.setState({modalVisible: false});
  };

  render() {
    return (
      <Fragment>
        <TouchableOpacity
          onPress={this.showPopup}
          style={theme.common.iconButton}>
          <Icon
            name={this.props.icon}
            size={20}
            style={this.props.buttonStyle}
            color={this.props.color || theme.variables.primary}
          />
        </TouchableOpacity>
        {this.props.children(this.state.modalVisible, this.hidePopup)}
      </Fragment>
    );
  }
}
