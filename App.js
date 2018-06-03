import React, { Component, PureComponent } from 'react'
import { Platform, TouchableWithoutFeedback, Animated, StyleSheet, Image, Text, ListView, View, Dimensions } from 'react-native'

import ParallaxScreen from './src/ParallaxScreen'

import PHOTOS from './src/data'
import { processImages, buildRows, normalizeRows } from './src/utils'
import PhotoGallery from './src/PhotoGallery'
import GridItem from './src/GridItem'
import EventEmitter from 'EventEmitter'

const
  { width, height } = Dimensions.get("window"),
  js = JSON.stringify,
  cw = (...args) => console.warn(args),
  bus = new EventEmitter(),
  isDroid = Platform.OS !== 'ios'

Object.assign(global, {cw, js, bus})

export default class App extends Component {
  componentWillMount() {
    const processedImages = processImages(PHOTOS)
    let rows = buildRows(processedImages, width)
    rows = normalizeRows(rows, width)

    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    })

    this.setState({
      dataSource: ds.cloneWithRows(rows)
    })
  }

  renderRow = (onPhotoOpen, row) =>
    <View
      style={{
        flexDirection: 'row',
        marginBottom: 5,
        justifyContent: 'space-between'
      }}>
      {row.map(item =>
        <GridItem item={item} key={item.id} onPhotoOpen={onPhotoOpen} />
      )}
    </View>

  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#000'}}>
        <PhotoGallery
          renderContent={({ onPhotoOpen }) =>
                         <ListView
                             dataSource={this.state.dataSource}
                             renderRow={this.renderRow.bind(this, onPhotoOpen)}
                           />}
                         />
                         )
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
})
