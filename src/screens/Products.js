import React, { Component, PureComponent } from 'react'
import { Platform, StyleSheet, Text, ListView, View, Dimensions } from 'react-native'
import { Transition } from 'react-navigation-fluid-transitions'

import GridItem from '../components/GridItem'
import PhotoGallery from '../components/PhotoGallery'
import { processImages, buildRows, normalizeRows } from '../../src/utils'

const
  config = require('../../config'),
  {getProducts} = require('../../src/shopify'),
  cheerio = require('react-native-cheerio'),
  { width, height } = Dimensions.get("window"),
  R = require('ramda')

const Products = class Products extends Component {
  state = {}

  async componentWillMount() {
    const
      products = await getProducts,
      productImages = processImages(products)
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
            },
            variants: p.node.variants.edges.map(v => v.node.id),
          }
        })

    // freshen products
    global.products = productImages
    storage.set('products', productImages)

    const
      rows = normalizeRows(buildRows(productImages, width), width),
      ds = new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2
      })
    this.setState({dataSource: ds.cloneWithRows(rows)})
  }

  renderRow = (onPhotoOpen, row) =>
    <View
      style={{
        flexDirection: 'row',
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
          {this.state.dataSource
            ?
              <PhotoGallery
                navigation={this.props.navigation}
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

export default Products

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: config.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
