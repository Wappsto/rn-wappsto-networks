import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const styles = StyleSheet.create({
  mapContainer: {
    height: 220,
    marginBottom: 20
  },
  map:{
   ...StyleSheet.absoluteFillObject
  }
});

const DeviceLocation = React.memo((geo) => {
  const latitude = parseFloat(geo?.geo?.latitude);
  const longitude = parseFloat(geo?.geo?.longitude);

  if(!latitude && !longitude){
    return null;
  }

  return (
    <View style={styles.mapContainer}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker coordinate={{ latitude : latitude , longitude : longitude }}/>
      </MapView>
    </View>
  )
});

export default DeviceLocation;
