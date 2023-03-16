import React from 'react';
import {
  View,
  KeyboardAvoidingView as RNKeyboardAvoidingView,
  StyleSheet,
  Platform,
} from 'react-native';
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
  },
});

const KeyboardAvoidingView = React.memo(({ offset, children }) => {
  return (
    <RNKeyboardAvoidingView
      keyboardVerticalOffset={offset}
      behavior={Platform.OS === 'ios' ? 'padding' : 'null'}
      style={styles.container}>
      <View style={styles.content}>{children}</View>
    </RNKeyboardAvoidingView>
  );
});

export default KeyboardAvoidingView;
