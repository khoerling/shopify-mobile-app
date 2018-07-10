import React, { Component, PureComponent } from 'react'
import { SafeAreaView, StatusBar, Platform, TouchableWithoutFeedback, Animated, StyleSheet, Image, Text, ListView, View, Dimensions } from 'react-native'
import { BlurView } from 'expo'

import ParallaxScreen from './src/ParallaxScreen'
import { processImages, buildRows, normalizeRows } from './src/utils'
import PhotoGallery from './src/PhotoGallery'
import GridItem from './src/GridItem'
import EventEmitter from 'EventEmitter'

global.config = require('./config')

const
  { width, height } = Dimensions.get("window"),
  js = JSON.stringify,
  cw = (...args) => console.warn(args),
  screen = Dimensions.get('window'),
  bus = new EventEmitter(),
  isDroid = Platform.OS !== 'ios',
  color = require('color')

Object.assign(global, {cw, js, bus})

const
  {getProducts} = require('./src/api')

export default class App extends Component {
  state = {
  }

  async componentWillMount() {
    const
      products = await getProducts,
      productImages = processImages(products)
        .filter(p => p.node.productType === 'Meal')
        .map((p, id) => {
          return {
            id,
            title: p.node.title,
            width: id % 5 === 0 ? 1024 : 1024 / 3,
            type: p.node.productType,
            amount: p.node.priceRange ? p.node.priceRange.maxVariantPrice.amount : "",
            height: id % 5 === 0 ? 1024 : 1024 / 3,
            source: {
              uri: p.node.images.edges[0].node.transformedSrc,
              cache: 'force-cache'
            }
          }
        })
    global.products = productImages // stash
    let rows = buildRows(productImages, width)
    rows = normalizeRows(rows, width)

    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    })

    this.setState({dataSource: ds.cloneWithRows(rows)})
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
      <View style={styles.container}>
        <StatusBar hidden={true} />
        <View style={[styles.ribbon]}>
          <SafeAreaView>
            <Text style={styles.fillUp}>FILL UP!</Text>
          </SafeAreaView>
        </View>
        {this.state.dataSource
          ?
            <PhotoGallery
              renderContent={({ onPhotoOpen }) =>
                <ListView
                  dataSource={this.state.dataSource}
                  renderRow={this.renderRow.bind(this, onPhotoOpen)}
                />}
            />
          : null}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: config.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ribbon: {
    top: 0,
    position: 'absolute',
    width: screen.width,
  },
  fillUp: {
    fontWeight: 'bold',
    fontSize: 30,
    textAlign: 'center',
    color: config.muted,
  },
})
