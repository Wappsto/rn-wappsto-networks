import React from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  spinner: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 99,
    backgroundColor: 'rgba(255, 255, 255, .4)'
  }
});

const ItemDeleteIndicator = React.memo(({ request }) => {
  if(request && request.status === 'pending'){
    return (
      <ActivityIndicator style={styles.spinner} />
    );
  }
  return null;
});

export default ItemDeleteIndicator;
