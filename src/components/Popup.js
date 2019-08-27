import React, { Component } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableWithoutFeedback
} from 'react-native';

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
          <View style={styles.container}>
            <TouchableWithoutFeedback>
              <View style={this.props.contentStyle || styles.content}>
                {this.props.children}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)'
  },
  content: {
    backgroundColor: 'white',
    margin: 40,
    padding: 40
  }
});
