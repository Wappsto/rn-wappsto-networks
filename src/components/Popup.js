import React from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StatusBar
} from 'react-native';

import Icon from 'react-native-vector-icons/Feather';
import theme from '../theme/themeExport';
import color from 'color';

const styles = StyleSheet.create({
  popupOverlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.variables.popupOverlayColor
  },
  popupContent: {
    width:'95%',
    borderWidth: theme.variables.borderWidth,
    borderColor: theme.variables.popupBorderColor,
    backgroundColor: theme.variables.popupBackground,
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
          <StatusBar backgroundColor={color(theme.variables.statusBarBgDark).darken(0.5)} barStyle={theme.variables.statusBarColorLight} />
          <TouchableWithoutFeedback>
            <View style={[styles.popupContent, contentStyle]}>
              {children}
              <TouchableOpacity
                onPress={hide}
                style={styles.closeButton}>
                {!hideCloseIcon &&
                  <Icon name='x' size={24} color={theme.variables.textSecondary} />
                }
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
})

export default Popup;
