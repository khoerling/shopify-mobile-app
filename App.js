import React, { Component, PureComponent } from 'react'
import { Easing, TouchableWithoutFeedback, ImageBackground, SafeAreaView, StatusBar, Platform, StyleSheet, Text, ListView, View, Dimensions } from 'react-native'
import { Transition, FluidNavigator } from 'react-navigation-fluid-transitions'
import EventEmitter from 'EventEmitter'

import GridItem from './src/GridItem'
import Parallax from './src/screens/Parallax'
import Intro from './src/screens/Intro'
import PhotoGallery from './src/screens/PhotoGallery'
import { processImages, buildRows, normalizeRows } from './src/utils'

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
  {getProducts} = require('./src/api'),
  cheerio = require('react-native-cheerio'),
  R = require('ramda')

const App = class App extends Component {
  state = {
  }

  async componentWillMount() {
    const
      products = await getProducts,
      productImages = processImages(products)
        .filter(p => p.node.productType === 'Meal')
        .map((p, id) => {
          const $ = cheerio.load(p.node.descriptionHtml)
          return {
            id,
            title: p.node.title,
            width: id % 5 === 0 ? 1024 : 1024 / 3,
            ingredients: $('.ingredients p').text(),
            description: $('.description p').text(),
            attributes: R.flatten($('.details li')
              .text()
              .replace(/[\n]+/g, "\n")
              .split("\n")),
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
        marginBottom: 2,
        justifyContent: 'space-between'
      }}>
      {row.map(item =>
        <GridItem item={item} key={item.id} onPhotoOpen={onPhotoOpen} />
      )}
    </View>

  render() {
    return (
      <Transition appear="vertical">
      <View style={styles.container}>
        <StatusBar hidden={true} />
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
      </Transition>
    )
  }
}

const Navigator = FluidNavigator({
  intro: { screen: Intro },
  app: { screen: App },
}, {
  transitionConfig: {
    duration: 350,
    easing: Easing.out(Easing.cubic)
  },
  navigationOptions: {
    gesturesEnabled: false,
  },
})

export default Navigator

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: config.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ribbon: {
    top: 0,
    position: 'absolute',
    width: width,
  },
  fillUp: {
    fontWeight: 'bold',
    fontSize: 30,
    textAlign: 'center',
    color: config.accent,
  },
  img: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    width,
  },
})
