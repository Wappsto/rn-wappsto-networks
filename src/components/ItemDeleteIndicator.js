import React from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  spinner: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 99,
    backgroundColor: 'grey',
    opacity: 0.4
  },
  spaceBetween: {
    justifyContent: 'space-between',
    marginRight: 20
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
