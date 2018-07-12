import React, {Component} from 'react';
import {
  Easing,
  Platform,
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'
import { Haptic } from 'expo'

import config from '../config'

const isDroid = Platform.OS !== 'ios'

export default class Counter extends React.Component {
  state = {
    isOpen: this.props.isOpen,
    counter: this.props.counter || 1,
    animation: new Animated.Value(this.props.isOpen ? 1 : 0),
    tapAnimation: new Animated.Value(0)
  }

  startCounterAnimation = () => {
    if (!this.state.isOpen){
      if (!isDroid) Haptic.impact()
      Animated.timing(this.state.animation, {
        toValue: 1,
        easing: Easing.elastic(1.1),
        duration: 200
      }).start(() => this.setState({isOpen: 1}))
    } else {
      this.increaseCount()
    }
  }

  increaseCount = () => {
    if (!isDroid) Haptic.impact()
    this.setState({counter: this.state.counter + 1}, _ => this.animateQuanitityChange(true))
    if (this.props.onPress) this.props.onPress(this.state.counter + 1)
  }

  decreaseCount = () => {
    if (!isDroid) Haptic.selection()
    if (this.state.counter > 0){
      this.setState({counter: this.state.counter - 1}, _ => this.animateQuanitityChange(false))
    }
    if (this.props.onPress) this.props.onPress(this.state.counter - 1)
  }

  animateQuanitityChange = (inc) => {
    Animated.timing(this.state.tapAnimation, {
      toValue: inc ? 1.01 : .4,
      duration: inc ? 200 : 80
    }).start(() => this.state.tapAnimation.setValue(0))
  }

  render() {
    const
      width = this.state.animation.interpolate({
        inputRange: [0, 1],
        outputRange: [48, 160]
      }),
    scale = {
      transform: [
        {
          scale: this.state.tapAnimation.interpolate({
            inputRange: [0, .2, .8, 1],
            outputRange: [1, 1.2, .8, 1]
          }),
        }
      ]},
      transform = {
        transform: [
          {
            translateX: this.state.animation.interpolate({inputRange: [0, 1], outputRange: [-25, 0]})
          },
        ]
      }
    return (
      <Animated.View style={[styles.container, {width}]}>
        <TouchableWithoutFeedback onPress={this.decreaseCount} hitSlop={{ top: 30, left: 30, right: 30, bottom: 30 }}>
          <Animated.View style={[styles.incdec, {opacity: this.state.animation}]}>
            <Icon name="md-remove" size={22} color="white" />
          </Animated.View>
        </TouchableWithoutFeedback>
        <Animated.View style={[styles.counter, scale, {opacity: this.state.animation}]}>
          <Animated.Text style={[styles.counterText]}>{this.state.counter}</Animated.Text>
        </Animated.View>
        <TouchableWithoutFeedback onPress={this.startCounterAnimation} hitSlop={{ top: 30, left: 30, right: 30, bottom: 30 }}>
          <Animated.View style={[styles.incdec, transform]}>
            <Icon name="md-add" size={22} color="white" />
          </Animated.View>
        </TouchableWithoutFeedback>
      </Animated.View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: config.accent,
    borderRadius: 100,
    padding: 5,
  },
  counterText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: config.white,
    paddingHorizontal: 15,
  },
  incdec: {
  },
})
