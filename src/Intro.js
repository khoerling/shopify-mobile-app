import React from 'react'
import { TouchableWithoutFeedback, Animated, StyleSheet, Image, ImageBackground, Text, View, Dimensions } from 'react-native'
import { Haptic } from 'expo'

const
  config = require('../config'),
  { width, height } = Dimensions.get('window')

export default class Intro extends React.Component {
  state = {
    collapsed: false,
  }

  render() {
    return (
      <View style={styles.container}>
        <ImageBackground style={styles.img} source={require('../assets/images/Pig-Closeup.jpg')}>
          <View style={styles.chooser}>
            <Text style={styles.text}>WEEKLY MEALS</Text>
          </View>
        </ImageBackground>
        <Image style={styles.splitter} resizeMode={'contain'} source={require('../assets/images/pick-one-vertical.png')}/>
        <ImageBackground style={styles.img} source={require('../assets/images/Girl-with-Pig.jpg')}>
          <View style={styles.chooser}>
            <Text style={styles.text}>ONE TIME ORDER</Text>
          </View>
        </ImageBackground>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: config.white,
  },
  chooser: {
    flex: 1,
    marginVertical: 25,
    marginHorizontal: 15,
    borderWidth: 2,
    borderColor: config.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontWeight: 'bold',
    fontSize: 50,
    textAlign: 'center',
    letterSpacing: 2,
    color: config.white,
  },
  img: {
    flex: 1,
    width,
  },
  splitter: {
    flex: 1,
    width,
  },
})
