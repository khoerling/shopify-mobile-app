import {
  Image,
  Text,
  View,
  Linking,
  Dimensions,
  TouchableOpacity,
  Platform,
  ScrollView,
  StyleSheet,
  PermissionsAndroid,
  TouchableWithoutFeedback,
} from 'react-native'
import React, { Component, PureComponent } from 'react'
import { isIphoneX, ifIphoneX } from 'react-native-iphone-x-helper'

const
  screen = Dimensions.get('window'),
  Button = require('./Button')

const Stack = class Stack extends Component {
  componentDidMount() {
    global.hideMenu()
    global.goBack = _ => this.goBack()
  }

  goBack(noMenuToggle) {
    const
      p = this.props,
      state = p.navigation.state
    if (!state.params) state.params = {noMenuToggle: false}
    if (p.navigation) p.navigation.goBack(null)
    if (!state.params.noMenuToggle && !p.noMenuToggle && !noMenuToggle) global.showMenu()
  }

  onPress() {
    if (this.props.onClose) {
      this.props.onClose() // use parent
    } else {
      this.goBack()
    }
  }

  render() {
    const
      contents = _ =>
        <View style={styles.centered}>
      <Text style={[config.styles.h1, {marginTop: 25}]}>{this.props.title && this.props.title.toUpperCase()}</Text>
          {this.props.children}
          <TouchableWithoutFeedback
            onPress={_ => this.onPress()}
            hitSlop={{ top: 8, left: 8, right: 8, bottom: 8 }}
          >
            <View
              style={[styles.close, {marginTop: this.props.noScrollView ? (isIphoneX ? 150 : 80) : 45}]}>
              {this.props.icon === 'close'
                ? <Image
                  source={require('../../assets/images/close.png')}
                  style={styles.icon} />
                : <Image
                  source={require('../../assets/images/back.png')}
               style={[styles.icon, {marginLeft: -7}]} />
              }
            </View>
          </TouchableWithoutFeedback>
        </View>,
      button = _ =>
        <Button
          title={this.props.buttonTitle}
          style={this.props.buttonStyle
            ? [config.styles.bottomButton, this.props.buttonStyle]
            :  config.styles.bottomButton}
          onPress={this.props.buttonOnPress} />

    return (
        <View style={{backgroundColor: config.backgroundColor, flex: 1}}>
          {this.props.noScrollView
           ? <View style={[styles.container, this.props.style]}>{contents()}</View>
           : <ScrollView style={[styles.container, this.props.style, {paddingTop: isIphoneX ? 90 : 30}]}>
             {contents()}
             {this.props.buttonOnPress && !isIphoneX ? button() : null}
           </ScrollView>}
          {this.props.buttonOnPress && isIphoneX ? button() : null}
        </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    height: screen.height,
    marginLeft: 3,
    backgroundColor: 'transparent',
    ...StyleSheet.absoluteFillObject,
    ...ifIphoneX({marginTop: -50}),
  },
  icon: {
    opacity: .45,
    height: 35,
    width: 35,
  },
  centered: {
    justifyContent: 'center',
    flex: 1,
  },
  close: {
    position: 'absolute',
    ...ifIphoneX({
      top: -65,
      left: 15,
    }, {
      left: 10,
      top: -50,
    })
  },
  header: {
    backgroundColor: 'transparent',
  },
  bottomGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
})

module.exports = Stack
