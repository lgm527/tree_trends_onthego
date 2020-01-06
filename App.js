import React from 'react';
import { StyleSheet, Text, View, Image, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Dropdown from './Dropdown.js';

export default class App extends React.Component {

  state = {
    region: {
      latitude: 40.7085874,
      longitude: -73.963434,
      latitudeDelta: 0.017,
      longitudeDelta: 0.017
    },
    trees: [],
    neighborhood: 'Williamsburg'
  }

  componentDidMount() {
    this.treeFetch(this.state.neighborhood);
  }

  treeFetch(n) {
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
      this.setState({
        trees: trees,
        region: {
          latitude: Number(trees[500].latitude),
          longitude: Number(trees[500].longitude),
          latitudeDelta: 0.017,
          longitudeDelta: 0.017
        }
      })
    })
  }

  normalizeString(str) {
    let res
    let theString
      if (str !== undefined && str !== null) {
        theString = str.replace(/[^a-zA-Z\d\s:]*/g, '')
        if (str.includes(' ')){
        let words = theString.split(' ')
        let result = []
        words.forEach((word) => {
          result.push( word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() )
        })
        res = result.join(' ')
        } else {
         res = theString.charAt(0).toUpperCase() + theString.slice(1).toLowerCase()
        }
      }
    return res
  }

  render() {

    const allTress = this.state.trees.map((tree) => {
      let coords = {latitude: Number(tree.latitude), longitude: Number(tree.longitude)}
      let title = this.normalizeString(tree.spc_common)
      let description = this.normalizeString(tree.address)
      return <Marker
        coordinate={coords}
        title={title}
        description={description}
        key={tree.tree_id}
        image={require('./assets/tree.png')}
      />
    })

    return (
      <View style={styles.container}>
        <Image source={require('./assets/treetrends.png')} />

        <Dropdown treeFetch={this.treeFetch} />

        <MapView style={styles.mapStyle} region={this.state.region}>
        {allTress}
        </MapView>
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
