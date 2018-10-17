import React, { Component, PureComponent } from 'react'
import { Easing, TouchableWithoutFeedback, ImageBackground, SafeAreaView, StatusBar, Platform, StyleSheet, Text, ListView, View, Dimensions } from 'react-native'
import { Transition, FluidNavigator } from 'react-navigation-fluid-transitions'
import EventEmitter from 'EventEmitter'
import { KeepAwake } from 'expo'

global.config = require('./config')

import Intro from './src/screens/Intro'
import Products from './src/screens/Products'
import Cart from './src/screens/Cart'
import YourOrder from './src/screens/YourOrder'

const
  storage = require('./src/storage'),
  format = require('comma-number'),
  js = JSON.stringify,
  cw = (...args) => console.warn(args),
  screen = Dimensions.get('window'),
  bus = new EventEmitter(),
  isDroid = Platform.OS !== 'ios',
  color = require('color')

Object.assign(global, {cw, js, bus, storage, format})

const App = class App extends Component {
  state = {}
  render() {
    return (
      <View style={styles.container}>
        {__DEV__ ? <KeepAwake /> : null}
        <StatusBar hidden={true} />
        <Products navigation={this.props.navigation} />
      </View>
    )
  }
}

const Navigator = FluidNavigator({
  app: { screen: App },
  cart: { screen: Cart },
  products: { screen: Products },
  intro: { screen: Intro },
  order: { screen: YourOrder },
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
    backgroundColor: config.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
