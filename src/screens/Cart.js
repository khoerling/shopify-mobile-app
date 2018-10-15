import React, { Component, PureComponent } from 'react'
import { Animated, Easing, View, Text, Image, TouchableOpacity, ActivityIndicator, Platform, StyleSheet } from 'react-native'
import RotateText from 'react-native-ticker'
import { isIphoneX, ifIphoneX } from 'react-native-iphone-x-helper'
import { Transition } from 'react-navigation-fluid-transitions'

const
  config = require('../../config'),
  color = require('color'),
  cart = require('../api/cart'),
  inActiveColor = color(config.darkGrey).lighten(.15)

const Cart = class Cart extends Component {
  constructor(props) {
    super(props)
    this.cartAnimation = new Animated.Value(0)
    this.state = {
      items: [],
      itemsTotal: 0,
      itemsCount: 0,
      isCartActive: false,
    }
  }

  animate() {
    this.cartAnimation.setValue(0)
    Animated.timing(this.cartAnimation, {
      toValue: 1.5,
      duration: 350,
      useNativeDriver: true,
      easing: Easing.elastic(3)
    }).start()
  }

  async componentDidMount() {
    bus.addListener('cart', async items => {                                               // realtime
      const
        itemsTotal = await cart.total(items),
        itemsCount = await cart.count(items)
      if (itemsTotal === this.state.itemsTotal && itemsCount === this.state.itemsCount) return // guard
      this.animate()                                                                      // go
      this.setState({items, itemsTotal, itemsCount, isCartActive: true})                     // updated
      if (this.timer) clearTimeout(this.timer)
      this.timer = setTimeout(_ => this.setState({isCartActive: false}), 1234)
    })
    this.setState({                                                                       // initial
      items: await cart.getAll(),
      itemsTotal: await cart.total(),
      itemsCount: await cart.count(),
    })
  }
  render() {
    return (
      <Transition appear="vertical">
        <View style={{flex: 1}}>
          <View style={[styles.container, this.props.style || {}]}>
            <Animated.View
              style = {[{flexDirection: 'row', marginLeft: 5},
                        {transform: [
                          {scale: this.cartAnimation.interpolate({
                            inputRange: [0, 1, 2],outputRange:[1, 0.8, 1]
                          })}
                        ]}
              ]}>
              {this.state.items
                ? <RotateText
                      text={`${this.state.itemsCount} ITEMS`}
                      style={{marginLeft: 10, marginTop: isIphoneX ? -10 : 7}}
                      textStyle={[styles.h2, {color: this.state.isCartActive ? config.accent : inActiveColor}]}
                      rotateTime={175} />
              : null}
            </Animated.View>
            <RotateText text={`$${format(this.state.itemsTotal)}`} style={{marginTop: isIphoneX ? -16 : 0}} textStyle={styles.h1} rotateTime={250} />
            <TouchableOpacity
              activeOpacity={.9}
              style={[styles.button, styles.contactButton]}
              onPress={_ => { if (this.props.onPress) this.props.onPress() }}>
              <Text style={styles.buttonText}>VIEW ORDER</Text>
            </TouchableOpacity>
          </View>
          {this.props.children}
        </View>
      </Transition>)
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowRadius: 20,
    shadowOpacity: .2,
    backgroundColor: config.dark,
    position: 'absolute',
    bottom: 43,
    height: isIphoneX ? 80 : 68,
    left: 0,
    right: 0,
    borderTopWidth: 2,
    borderColor: config.lightContrast,
    zIndex: 9,
  },
  h1: {
    fontSize: 25,
    color: config.darkGrey,
  },
  cart: {
    marginTop: isIphoneX ? -14 : 3,
    marginLeft: -8,
  },
  h2: {
    ...config.styles.h3,
    fontSize: 20,
    justifyContent: 'center',
    alignSelf: 'center',
    fontWeight: 'bold',
  },
  button: {
    height: 48,
    justifyContent: 'center',
    borderRadius: 2,
    marginRight: -14,
    marginLeft: 20,
    alignSelf: 'flex-end',
  },
  buttonText: {
    color: config.light,
    textAlign: 'center',
    letterSpacing: .3,
  },
  contactButton: {
    width: 125,
    top: isIphoneX ? -12 : 0,
    marginRight: -5,
    backgroundColor: config.accent,
  },
})

export default Cart
