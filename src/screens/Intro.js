import React from 'react'
import { Easing, TouchableWithoutFeedback, Animated, StyleSheet, Image, ImageBackground, Text, View, Dimensions } from 'react-native'
import { Transition, FluidNavigator } from 'react-navigation-fluid-transitions'
import { BlurView, Haptic } from 'expo'

const
  config = require('../../config'),
  { width, height } = Dimensions.get('window'),
  AnimatedBlurView = Animated.createAnimatedComponent(BlurView)

export default class Intro extends React.Component {
  state = {
    buildIn: new Animated.Value(80),
    isLoading: false,
    imagesLoaded: 0,
    isHidden: false,
  }

  onLoad() {
    const
      imagesLoaded = this.state.imagesLoaded + 1,
      isLoading = imagesLoaded <= 2
    this.setState({isLoading, imagesLoaded}, _ => {
      if (!isLoading) this.buildIn()
    })
  }

  buildIn() {
    Animated.timing(this.state.buildIn, {
      toValue: 0,
      easing: Easing.in(Easing.cubic),
      duration: 150,
    }).start(_ => {
      this.setState({isHidden: true})
    })
  }

  select(selection) {
    this.props.navigation.navigate('app')
  }

  render() {
    return (
      <View style={styles.container}>
          <ImageBackground onLoadEnd={_ => this.onLoad()} style={styles.img} source={require('../../assets/images/Pig-Closeup.jpg')}>
            <TouchableWithoutFeedback onPress={_ => this.select('weekly')}>
              <View style={styles.chooser}>
                <Text style={styles.text}>WEEKLY MEALS</Text>
              </View>
            </TouchableWithoutFeedback>
          </ImageBackground>
            <Image onLoadEnd={_ => this.onLoad()} style={styles.splitter} resizeMode={'contain'} source={require('../../assets/images/pick-one-vertical.png')}/>
          <ImageBackground onLoadEnd={_ => this.onLoad()} style={styles.img} source={require('../../assets/images/Girl-with-Pig.jpg')}>
            <TouchableWithoutFeedback onPress={_ => this.select('weekly')}>
              <View style={styles.chooser}>
                <Text style={styles.text}>ONE TIME ORDER</Text>
              </View>
            </TouchableWithoutFeedback>
          </ImageBackground>
          {this.state.isHidden
            ? null
            : <AnimatedBlurView
              tint="light"
              intensity={this.state.buildIn}
              style={StyleSheet.absoluteFill} />
            }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: config.light,
  },
  chooser: {
    flex: 1,
    marginVertical: 25,
    marginHorizontal: 15,
    borderWidth: 2,
    borderColor: config.light,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontWeight: 'bold',
    fontSize: 50,
    textAlign: 'center',
    letterSpacing: 2,
    color: config.light,
  },
  img: {
    flex: 1,
    width,
  },
  splitter: {
    flex: 1,
    width,
    maxHeight: 200,
  },
})
