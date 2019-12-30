import React from 'react';
import { StyleSheet, Text, View, Image, Dimensions } from 'react-native';
import MapView from 'react-native-maps';

export default class App extends React.Component {

  state = {
    region: {
      latitude: 40.7085874,
      longitude: -73.963434,
      latitudeDelta: 0.01322,
      longitudeDelta: 0.0821,
    },
    trees: [],
    neighborhood: 'Williamsburg'
  }

  componentDidMount() {
    this.treeFetch(this.state.neighborhood);
  }

  treeFetch(n){
    fetch(`https://data.cityofnewyork.us/resource/uvpi-gqnh.json?nta_name=${n}&status=Alive&steward=None`,{
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-App-Token': 'muZjL5D3H5UGU2TUlPOR4IjM6'
      }
    })
    .then(res => res.json())
    .then(trees => {
      console.log(trees);
      // this.setState({
      //   trees: trees,
      //   region: {
      //     latitude: trees[400].latitude,
      //     longitude: trees[400].longitude
      //   }
      // })
    })
  }


  render() {
    return (
      <View style={styles.container}>
        <Image source={require('./assets/treetrends.png')} />
        <Image source={require('./assets/loraxicon.jpg')} />
        <MapView style={styles.mapStyle} region={this.state.region} />
      </View>
    )
  }
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
