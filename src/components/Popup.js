import React from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StatusBar,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
    backgroundColor: theme.variables.popupBackground,
    paddingHorizontal: 20,
    paddingVertical: 10
  },
  popupContentWithBorder: {
    width:'95%',
    borderWidth: theme.variables.borderWidth,
    borderColor: theme.variables.popupBorderColor,
    paddingVertical: 20
  },
  closeButton: {
    padding: 10,
    position: 'absolute',
    zIndex: 10,
    right: 0
  }
});

const Popup = React.memo(({ fullScreen, animationType, visible, hide, onRequestClose, contentStyle, children, hideCloseIcon }) => {
  const Wrapper = fullScreen ? ScrollView : React.Fragment;
  return (
    <Modal
      transparent={true}
      visible={visible}
      onRequestClose={onRequestClose}
    >
      <TouchableWithoutFeedback onPress={hide}>
        <SafeAreaView style={styles.popupOverlay}>
          <Wrapper>
            <StatusBar backgroundColor={color(theme.variables.statusBarBgDark).darken(0.5).string()} barStyle={theme.variables.statusBarColorLight} />
            <TouchableWithoutFeedback>
              <View style={[styles.popupContent, (!fullScreen && styles.popupContentWithBorder), contentStyle]}>
                {children}
                {!hideCloseIcon &&
                  <TouchableOpacity
                    onPress={hide}
                    style={styles.closeButton}>
                    <Icon name='x' size={24} color={theme.variables.textSecondary} />
                  </TouchableOpacity>
                }
              </View>
            </TouchableWithoutFeedback>
          </Wrapper>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </Modal>
  );
})

export default Popup;
