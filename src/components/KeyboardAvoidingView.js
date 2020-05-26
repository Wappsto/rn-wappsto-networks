import React from 'react';
import {View, KeyboardAvoidingView as RNKeyboardAvoidingView, StyleSheet, Platform } from 'react-native';
const styles = StyleSheet.create({
  container: {flex:1},
  content:{flex:1, justifyContent: 'flex-end'}
});

const KeyboardAvoidingView = React.memo(({children }) => {
  return (
    <RNKeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'null'}
      style={styles.container}
    >
      <View style={styles.content}>
        {children}
      </View>
    </RNKeyboardAvoidingView>
  );
});

export default KeyboardAvoidingView;
