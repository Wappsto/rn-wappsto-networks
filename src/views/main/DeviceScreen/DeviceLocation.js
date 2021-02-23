import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView from 'react-native-maps';

const styles = StyleSheet.create({
  mapContainer: {
    height: 240,
    marginTop: -20,
    marginLeft:-20,
    marginRight: -20,
    marginBottom: 20
  },
  map:{
   ...StyleSheet.absoluteFillObject
  },
  marker: {
    height: 48,
    width: 48
  },
  markerFixedWrapper: {
    marginLeft: -24,
    marginTop: -48,
    left: '50%',
    top: '50%'
  }
});

const DeviceLocation = React.memo(() => {
  return (
    <View style={{height: 300}}>
      <MapView
        style={styles.map}
      />
    </View>
  )
});

export default DeviceLocation;
