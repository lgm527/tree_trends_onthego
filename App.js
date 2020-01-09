import React from 'react';
import { StyleSheet, Text, TextInput, View, Image, Dimensions, Modal } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import Dropdown from './Dropdown.js';
import openMap from 'react-native-open-maps';

export default class App extends React.Component {

  state = {
    region: {
      latitude: 40.7085874,
      longitude: -73.963434,
      latitudeDelta: 0.017,
      longitudeDelta: 0.017
    },
    trees: [],
    treeClicked: {
      latitude: 0,
      longitude: 0
    },
    neighborhood: 'Williamsburg',
    emailModalVisible: false,
    email: null
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

  updateNeighborhood = (newN) => {
    this.setState({neighborhood: newN})
    this.treeFetch(newN)
  }

  showModal(coordinates) {
    this.setState({
      treeClicked: {
        latitude: coordinates.latitude,
        longitude: coordinates.longitude
      },
      emailModalVisible: true
    })
  }

  openNativeMaps() {
    openMap({ latitude: this.state.treeClicked.latitude, longitude: this.state.treeClicked.longitude });
  }

  sendEmail() {
    //open native email app to share tree's details
  }

  render() {

    const allTress = this.state.trees.map((tree) => {
      let coords = {latitude: Number(tree.latitude), longitude: Number(tree.longitude)}
      let title = this.normalizeString(tree.spc_common)+' at '+this.normalizeString(tree.address)
      let description = 'Click here to email this tree'
      return <Marker
        coordinate={coords}
        title={title}
        description={description}
        key={tree.tree_id}
        image={require('./assets/tree.png')}>
        <Callout
        style={styles.calloutStyle}
        onPress={() => {this.showModal(coords)}}></Callout>
      </Marker>
    })

    return (
      <View style={styles.container}>
        <Image source={require('./assets/treetrends.png')} />

          <Modal
          visible={this.state.emailModalVisible} >
            <View style={styles.modalStyle}>
              <Text
              style={styles.closeModal}
              onPress={() => {this.setState({emailModalVisible: false})}}>
              ✖︎</Text>
              <Text>I want to send this to...</Text>
              <TextInput
              placeholder="Email Address"
              onChangeText={(email) => this.setState({email})}
              value={this.state.email}
              textContentType='emailAddress'
              />
              <Text
              style={styles.sendBtn}
              onPress={() => {this.sendEmail()}}>
              Email 📩</Text>
              <Text
              style={styles.mapBtn}
              onPress={() => {this.openNativeMaps()}}>
              Pin on Maps 📍</Text>
            </View>
          </Modal>

        <Dropdown updateNeighborhood={this.updateNeighborhood} />

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
  }, modalStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  calloutStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  closeModal: {
    color: 'red',
  },
  sendBtn: {
    color: 'blue',
    fontWeight: 'bold',
    padding: 5,
  },
  mapBtn: {
    color: 'brown',
    fontWeight: 'bold',
    padding: 5,
  }
});
