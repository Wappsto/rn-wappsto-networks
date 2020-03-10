import React from 'react';
import {
  Modal,
  View,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import theme from '../theme/themeExport';

const Popup = React.memo(({ animationType, visible, hide, onRequestClose, contentStyle, children, hideCloseIcon }) => {
  return (
    <Modal
      transparent={true}
      visible={visible}
      onRequestClose={onRequestClose}>
      <TouchableWithoutFeedback onPress={hide}>
        <View style={theme.common.popupOverlay}>
          <TouchableWithoutFeedback>
            <View style={contentStyle || theme.common.popupContent}>
              {children}
              <TouchableOpacity
                onPress={hide}
                style={{
                  padding: 10,
                  position: 'absolute',
                  zIndex: 10,
                  right: 0
                }}>
                {!hideCloseIcon && <Icon name="x" size={24} color={theme.variables.primary} />}
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
})

export default Popup;
