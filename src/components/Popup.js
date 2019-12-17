import React from 'react';
import {
  Modal,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TouchableWithoutFeedback,
} from 'react-native';

import Icon from 'react-native-vector-icons/Feather';
import theme from '../theme/themeExport';

const Popup = React.memo(({ animationType, visible, hide, onRequestClose, contentStyle, children }) => {
  return (
    <Modal
      animationType={animationType || 'none'}
      transparent={true}
      visible={visible}
      onRequestClose={onRequestClose}>
      <TouchableWithoutFeedback onPress={hide}>
        <SafeAreaView style={theme.common.safeAreaView}>
          <View style={theme.common.popupOverlay}>
            <TouchableWithoutFeedback>
              <View
                style={contentStyle || theme.common.popupContent}>
                <ScrollView>
                  {children}
                  <TouchableOpacity
                    onPress={hide}
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
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </Modal>
  );
})

export default Popup;
