import React, { Component, PureComponent } from 'react'
import {
  Image,
  Text,
  View,
  StyleSheet,
} from 'react-native'

const
  Button = require('./Button'),
  color  = require('color'),
  config = require('../../config')

module.exports = class Product extends Component {
  render() {
    const {arrow, product, children, onPress} = this.props
    if (!product || !product.title) return null
    return (
      <Button
        onPress={onPress}
        arrow={arrow}
        type={'medium'}
        hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
        arrowColor={config.darkGrey}
        style={styles.button}>
        <View style={{flexDirection: 'row', marginTop: -4}}>
          <View style={{ width: 180 }}>
            <Text style={styles.h2}>{product.title.toUpperCase()}</Text>
            <Text style={styles.small}>{product.type}</Text>
            <Text style={styles.small}>{product.vintage}</Text>
            <Text style={styles.small}>${format(product.price)}</Text>
          </View>
        </View>
        <View style={{ position: 'absolute', bottom: -10, right: 20}}>
          {this.props.children}
        </View>
      </Button>
    )
  }
}

const styles = StyleSheet.create({
  bottle: {
    height: 90,
    width: 75,
    backgroundColor: config.white,
    borderColor: config.white,
  },
  h2: {
    ...config.styles.h2,
    fontSize: 12,
    marginBottom: 5,
    textAlign: 'left',
  },
  small: {
    ...config.styles.h3,
    color: color(config.dark).lighten(2),
    marginTop: 2,
    marginBottom: 3,
    letterSpacing: 0,
    textAlign: 'left',
  },
})
