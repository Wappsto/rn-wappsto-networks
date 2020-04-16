import React from 'react';
import {
  Modal,
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StatusBar
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import theme from '../theme/themeExport';

const styles = StyleSheet.create({
  popupOverlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  popupContent: {
    backgroundColor: theme.variables.modalBgColor,
    margin: 20,
    padding: 20,
  },
  closeButton: {
    padding: 10,
    position: 'absolute',
    zIndex: 10,
    right: 0
  }
});

const Popup = React.memo(({ animationType, visible, hide, onRequestClose, contentStyle, children, hideCloseIcon }) => {
  return (
    <Modal
      transparent={true}
      visible={visible}
      onRequestClose={onRequestClose}>
      <TouchableWithoutFeedback onPress={hide}>
        <View style={styles.popupOverlay}>
          <StatusBar backgroundColor={theme.variables.primaryDark} barStyle='light-content' />
          <TouchableWithoutFeedback>
            <View style={[styles.popupContent, contentStyle]}>
              {children}
              <TouchableOpacity
                onPress={hide}
                style={styles.closeButton}>
                {!hideCloseIcon && <Icon name="x" size={24} color={theme.variables.textSecondary} />}
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
})

export default Popup;
