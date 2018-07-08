import React, { Component, PureComponent } from 'react'
import { Platform, TouchableWithoutFeedback, Animated, StyleSheet, Image, Text, ListView, View, Dimensions } from 'react-native'

import ParallaxScreen from './src/ParallaxScreen'
import PHOTOS from './src/data'
import { processImages, buildRows, normalizeRows } from './src/utils'
import PhotoGallery from './src/PhotoGallery'
import GridItem from './src/GridItem'
import EventEmitter from 'EventEmitter'

import { createHttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { graphql, compose, ApolloProvider } from 'react-apollo'
import gql from 'graphql-tag'

const
  { width, height } = Dimensions.get("window"),
  js = JSON.stringify,
  cw = (...args) => console.warn(args),
  bus = new EventEmitter(),
  isDroid = Platform.OS !== 'ios'

Object.assign(global, {cw, js, bus})

const
  httpLink = createHttpLink({ uri: 'https://dont-be-a-pig.myshopify.com/admin/api/graphql.json' }),
  middlewareLink = setContext(() => ({
    headers: {
      'Content-Type': 'application/graphql',
      'Authorization': 'Basic ZjlkMjk1YmE5OTI2YzMyMDYwNDM3MjY0Y2YyMmZiMTg6NDJhZWZmN2I0MDBjMjQyYzQyYTQ3ZWU1MGM4ODY4MDA='
    }
  })),
  client = new ApolloClient({
    link: middlewareLink.concat(httpLink),
    cache: new InMemoryCache(),
  })

export default class App extends Component {
  async componentWillMount() {
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
      <ApolloProvider client={client}>
        <View style={{flex: 1, backgroundColor: '#000'}}>
          <PhotoGallery
            renderContent={({ onPhotoOpen }) =>
              <ListView
                dataSource={this.state.dataSource}
                renderRow={this.renderRow.bind(this, onPhotoOpen)}
              />}
          />
        </View>
      </ApolloProvider>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
})
