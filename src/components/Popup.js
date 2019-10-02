import React, { Component } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableWithoutFeedback
} from 'react-native';

import theme from '../theme/themeExport';

export default class Popup extends Component {
  render() {
    return (
      <Modal
        animationType={this.props.animationType || "none"}
        transparent={true}
        visible={this.props.visible}
        onRequestClose={this.props.onRequestClose}
        >
        <TouchableWithoutFeedback onPress={this.props.hide}>
          <View style={theme.common.popupOverlay}>
            <TouchableWithoutFeedback>
              <View style={this.props.contentStyle || theme.common.popupContent}>
                {this.props.children}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }
}
