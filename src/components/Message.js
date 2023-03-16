import React, { useState, useCallback } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import Text from './Text';
import Icon from 'react-native-vector-icons/Feather';
import theme from '../theme/themeExport';

const styles = StyleSheet.create({
  container: {
    padding: 10,
    margin: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  closeBtn: {
    padding: 2,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
});

const Message = React.memo(({ style, message, type, closable, ...props }) => {
  const [messageVisible, setMessageVisible] = useState(true);

  const hideMessage = useCallback(() => {
    setMessageVisible(false);
  }, []);
  let textColor = theme.variables.textInverse;
  const setType = (type) => {
    switch (type) {
      case 'info':
        return { backgroundColor: theme.variables.secondary };
      case 'success':
        return { backgroundColor: theme.variables.success };
      case 'warning':
        return { backgroundColor: theme.variables.warning };
      case 'error':
        return { backgroundColor: theme.variables.alert };
      default:
        textColor = theme.variables.textColor;
        return { backgroundColor: theme.variables.lightGray };
    }
  };

  if (messageVisible) {
    return (
      <View {...props} style={[styles.container, setType(type), style]}>
        <Text color={textColor} content={message} />
        {closable && (
          <TouchableOpacity onPress={hideMessage} style={styles.closeBtn}>
            <Icon name="x" />
          </TouchableOpacity>
        )}
      </View>
    );
  } else {
    return null;
  }
});

export default Message;
