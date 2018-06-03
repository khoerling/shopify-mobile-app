import React, { Component, PureComponent } from 'react'
import { Platform, TouchableWithoutFeedback, Animated, StyleSheet, Image, Text, ListView, View, Dimensions } from 'react-native'

import ParallaxScreen from './src/ParallaxScreen'

import PHOTOS from './src/data'
import { processImages, buildRows, normalizeRows } from './src/utils'
import PhotoGallery from './src/PhotoGallery'
import GridItem from './src/GridItem'

const
  { width, height } = Dimensions.get("window"),
  cw = console.warn,
  js = JSON.stringify,
  isDroid = Platform.OS !== 'ios',
  stories = [
    {messages: [
      {key: 1, from: 'ben', msg: 'YO\nIt\'s Ben'},
      {key: 2, from: 'keith', msg: 'Waddddap!', right: true},
      {key: 3, from: 'keith', msg: 'Give this demo a spin and let me know your thoughts.  Likely a 2-column screen would exist in our navigation before this one, similar to Hooked, whereby pressing a Story loads this screen with the left/right swipes between Stories.\n\nSwipe up or press on these messages to show the next message, btw...', right: true},
      {key: 4, from: 'ben', msg: 'ok!!'},
      ]
    },
    {messages: [
      {key: 1, from: 'keith', msg: 'The man in black fled across the Desert, and the Gunslinger followed.'},
    ]},
    {messages: [
      {key: 1, from: 'keith', msg: 'a 3rd story begins...\n'},
      {key: 2, from: 'ben', msg: 'test, test, test, test, test, test, test, test, test, test, test, test...'},
    ]},
  ]

Object.assign(global, {cw, js})

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
  }}
    >
    {row.map(item =>
             <GridItem item={item} key={item.id} onPhotoOpen={onPhotoOpen} />
            )}
  </View>

  render() {
    return (
      <View style={{flex: 1}}>
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
