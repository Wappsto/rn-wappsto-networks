import React from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Button from '../../../components/Button';

const styles = StyleSheet.create({
  mapContainer: {
    height: 220,
    marginBottom: 20,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  directionButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
    paddingLeft: 12,
    paddingRight: 15,
    backgroundColor: '#4285F4',
  },
});

const DeviceLocation = React.memo(geo => {
  const latitude = parseFloat(geo?.geo?.latitude);
  const longitude = parseFloat(geo?.geo?.longitude);

  if (!latitude && !longitude) {
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
        }}>
        <Marker coordinate={{ latitude: latitude, longitude: longitude }} />
      </MapView>
      <Button
        style={styles.directionButton}
        icon="navigation"
        onPress={() => {
          Linking.openURL(
            'https://www.google.com/maps/dir/?api=1&destination=' + latitude + ',' + longitude,
          );
        }}
      />
    </View>
  );
});

DeviceLocation.displayName = 'DeviceLocation';
export default DeviceLocation;
