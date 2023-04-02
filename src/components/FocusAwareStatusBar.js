import { useIsFocused } from '@react-navigation/native';
import React from 'react';
import { StatusBar } from 'react-native';

function FocusAwareStatusBar(props) {
  const isFocused = useIsFocused();

  return isFocused ? <StatusBar {...props} /> : null;
}

export default FocusAwareStatusBar;
