import React from 'react';
import { StyleSheet, Text, TextInput, View, Image, Dimensions, Modal, Linking, Platform } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
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
    treeClicked: {
      latitude: 0,
      longitude: 0,
      info: null,
    },
    neighborhood: 'Williamsburg',
    modalVisible: false,
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

  showModal(coordinates, info) {
    this.setState({
      treeClicked: {
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        info: info,
      },
      modalVisible: true
    })
  }

  sendText() {
    if (Platform.OS === 'android') {
      Linking.openURL(`sms:?body=${this.state.treeClicked.info}`).catch(err => console.error('An error occurred', err));
    } else {
      Linking.openURL(`sms:&body=${this.state.treeClicked.info}`).catch(err => console.error('An error occurred', err));
    }
  }

  sendEmail() {
    if (Platform.OS === 'android') {
      Linking.openURL(`mailto:whoever@gmail.com?cc=?subject=Check out this Tree!&body=${this.state.treeClicked.info}`).catch(err => console.error('An error occurred', err));
    } else {
      Linking.openURL(`mailto:whoever@gmail.com?cc=&subject=Check out this Tree!&body=${this.state.treeClicked.info}`).catch(err => console.error('An error occurred', err));
    }
  }

  openMaps() {
    if (Platform.OS === 'android') {
      Linking.openURL(`geo:0,0?q=${this.state.treeClicked.latitude},${this.state.treeClicked.longitude}(${this.state.treeClicked.info})`).catch(err => console.error('An error occurred', err));
    } else {
      Linking.openURL(`http://maps.apple.com/?ll=${this.state.treeClicked.latitude},${this.state.treeClicked.longitude}&q=${this.state.treeClicked.info}`).catch(err => console.error('An error occurred', err));
    }
  }

  render() {

    const allTress = this.state.trees.map((tree) => {
      let coords = {latitude: Number(tree.latitude), longitude: Number(tree.longitude)}
      let title = this.normalizeString(tree.spc_common)+' at '+this.normalizeString(tree.address)
      let description = 'Click here to share this tree'
      return <Marker
        coordinate={coords}
        title={title}
        description={description}
        key={tree.tree_id}
        image={require('./assets/tree.png')}>
        <Callout
        style={styles.calloutStyle}
        onPress={() => {this.showModal(coords, title)}}></Callout>
      </Marker>
    })

    return (
      <View style={styles.container}>
        <Image source={require('./assets/treetrends.png')} />

          <Modal
          visible={this.state.modalVisible} >
            <View style={styles.modalStyle}>
              <Text
              style={styles.closeModal}
              onPress={() => {this.setState({modalVisible: false})}}>
              ✖︎</Text>
              <Text
              style={styles.shareText}>
              Share this Tree ❤️ 🌲 🌳 </Text>
              <Text
              style={styles.sendTextBtn}
              onPress={() => {this.sendText()}}>
              Text 📞</Text>
              <Text
              style={styles.sendEmailBtn}
              onPress={() => {this.sendEmail()}}>
              Email 📩</Text>
              <Text
              style={styles.mapBtn}
              onPress={() => {this.openMaps()}}>
              Pin on Map 📍</Text>
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
  },
  modalStyle: {
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
    fontSize: 40,
  },
  shareText: {
    padding: 5,
    fontSize: 20,
  },
  sendTextBtn: {
    color: 'green',
    fontWeight: 'bold',
    padding: 5,
    fontSize: 15,
  },
  sendEmailBtn: {
    color: 'blue',
    fontWeight: 'bold',
    padding: 5,
    fontSize: 15,
  },
  mapBtn: {
    color: 'brown',
    fontWeight: 'bold',
    padding: 5,
    fontSize: 15,
  }
});
