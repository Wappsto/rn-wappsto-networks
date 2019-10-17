import React, {Component} from 'react';
import {
  Modal,
  View,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';

import Icon from 'react-native-vector-icons/Feather';
import theme from '../theme/themeExport';

export default class Popup extends Component {
  render() {
    return (
      <Modal
        animationType={this.props.animationType || 'none'}
        transparent={true}
        visible={this.props.visible}
        onRequestClose={this.props.onRequestClose}>
        <TouchableWithoutFeedback onPress={this.props.hide}>
          <View style={theme.common.popupOverlay}>
            <TouchableWithoutFeedback>
              <View
                style={this.props.contentStyle || theme.common.popupContent}>
                <ScrollView>
                  {this.props.children}
                  <TouchableOpacity
                    onPress={this.props.hide}
                    style={{
                      padding: 10,
                      position: 'absolute',
                      zIndex: 10,
                      right: -10,
                      top: -10,
                    }}>
                    <Icon name="x" size={24} color={theme.variables.primary} />
                  </TouchableOpacity>
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }
}
