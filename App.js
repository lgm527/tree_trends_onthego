import React from 'react';
import { StyleSheet, Text, View, Image, Dimensions } from 'react-native';
import MapView from 'react-native-maps';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Welcome to</Text>
      <Image source={require('./assets/treetrends.png')} />
      <Image source={require('./assets/loraxicon.jpg')} />
      <MapView style={styles.mapStyle} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 173, 35, .6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapStyle: {
    width: Dimensions.get('window').width-20,
    height: Dimensions.get('window').height/2,
  }
});
