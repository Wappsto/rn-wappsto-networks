import React, { PureComponent, Fragment } from 'react';
import {
  View,
  TouchableOpacity
} from 'react-native';


import theme from "../theme/themeExport";
import Icon from 'react-native-vector-icons/Feather';

export default class ValueSettings extends PureComponent {
  state = {
    modalVisible: false
  }

  showPopup = () => {
    this.setState({ modalVisible: true });
  }

  hidePopup = () => {
    this.setState({ modalVisible: false });
  }

  render() {
    return (
      <Fragment>
        <TouchableOpacity onPress={this.showPopup}>
          <Icon name={this.props.icon} size={20} style={this.props.buttonStyle} color={theme.variables.primary}/>
        </TouchableOpacity>
        {this.props.children(this.state.modalVisible, this.hidePopup)}
      </Fragment>
    );
  }
}
