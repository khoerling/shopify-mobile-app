import React, { Component, PureComponent } from 'react'
import {
  Image,
  Text,
  View,
  Linking,
  TouchableOpacity,
  Platform,
  StyleSheet,
  PermissionsAndroid,
  TouchableHighlight,
} from 'react-native'
import Icon from 'react-native-vector-icons/SimpleLineIcons'
import { isIphoneX, ifIphoneX } from 'react-native-iphone-x-helper'

const
  Button      = require('../components/Button'),
  StackScreen = require('../components/StackScreen'),
  Product     = require('../components/Product'),
  config      = require('../../config'),
  cart        = require('../api/cart')

const YourOrder = class YourOrder extends Component {
  constructor(props) {
    super(props)
    this.state = {
      products: cart.getCached() || [],
    }
  }

  async componentDidMount() {
    bus.addListener('cart', async products => { // realtime
      this.setState({products})                // updated
    })
    this.setState({                         // initial
      products: await cart.getAll(),
    })
  }

  goTasting() {
    const { navigate } = this.props.navigation
    navigate('Tasting', {noMenuToggle: true})
  }

  counterPressed(product, count) {
    product.qty = count
    cart.upsertItem(product)
  }

  render() {
    const { navigate } = this.props.navigation
    return (
      <StackScreen
        title='Your Order'
        screenProps={this.props.screenProps}
        buttonTitle={this.state.products.length ? 'Continue to Order Review' : 'Go Back'}
        buttonStyle={styles.buttonStyle}
        buttonOnPress={_ => this.state.products.length ? this.goTasting() : global.goBack(true)}
        navigation={this.props.navigation}>
        <View style={styles.container}>
          {this.state.products.length
            ? <Button
                title={'Continue to Order Review'}
                style={[config.styles.bottomButton, {marginHorizontal: 0, marginBottom: 20, marginTop: 10}]}
                onPress={_ => this.goTasting()} />
            : <Text style={config.styles.h2}>is Empty</Text>}
            {this.state.products.map(product => {
              product = Object.assign(
                config.products.find(p => p.title === product.title) || {}, product)
              return (
                <Product
                  key={product.name + Math.random()}
                  product={product}
                  onPress={_ => { if (product.description) navigate('WineDetail', {product, noMenuToggle: true})} }>
                </Product>)
            })}
        </View>
      </StackScreen>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  buttonStyle: {
    ...config.styles.bottomButton,
    ...ifIphoneX({
    },{
      marginTop: 20,
      marginBottom: 100,
    })
  },
  row: {
    justifyContent: 'center',
    flexDirection: 'row',
  },
  h2: {
    ...config.styles.bold,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 10,
    letterSpacing: 1,
    color: 'red',
  },
  h3: {
    marginTop: 30,
    ...config.styles.h3,
  },
  product: {
    backgroundColor: 'transparent',
  },
  small: {
    ...config.styles.medium,
    color: config.darkGrey,
    lineHeight: 15,
    marginTop: 15,
    marginBottom: 30,
    fontSize: 12,
  },
  products: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 20,
  },
})

module.exports = YourOrder
