import React from 'react'
import { Animated, Easing, StyleSheet, Text, View, TouchableWithoutFeedback } from 'react-native'
import PhotoGallery from './PhotoGallery'
import { LinearGradient } from 'expo'

const Item = class Item extends React.Component {
  state = {
    opacity: new Animated.Value(1),
  }
  componentWillMount() {
    bus.addListener('storySelected', _ => {
      // build-out titles
      this.state.opacity.setValue(0)
    })
    bus.addListener('photoGalleryClosed', photoId => {
      // build-in titles
      Animated.timing(this.state.opacity, {
        toValue: 1,
        duration: 700,
        easing: Easing.easeOutExpo,
        useNativeDriver: true
      }).start()
    })
  }

  render() {
    const { item, onPhotoOpen } = this.props
    return (<TouchableWithoutFeedback onPress={() => onPhotoOpen(item)}>
      <View>
        <PhotoGallery.Photo
          photo={item}
          style={{
            width: item.width,
            height: item.height
          }}
        />
        <Animated.View style={[styles.container, {opacity: this.state.opacity}]}>
          <LinearGradient colors={['transparent', 'rgba(0,0,0,.3)', 'rgba(0,0,0,.9)', 'rgba(0,0,0,.99)']} style={styles.gradient}>
            <View>
              <Text style={styles.h1}>{item.title}</Text>
              <Text style={styles.h2}>{item.genre.toUpperCase()}</Text>
            </View>
          </LinearGradient>
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>)
  }
}


const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  h1: {
    fontSize: 25,
    lineHeight: 24,
    letterSpacing: -1,
    color: '#fff',
    fontWeight: 'bold',
    paddingBottom: 5,
    paddingRight: 5,
  },
  h2: {
    fontSize: 15,
    lineHeight: 15,
    color: '#fff',
    opacity: .9,
    fontWeight: 'bold',
    paddingBottom: 5,
    paddingRight: 5,
  },
  gradient: {
    flex: 1,
    paddingTop: 150,
    paddingLeft: 10,
    alignItems: 'flex-start',
    backgroundColor: 'transparent',
  },
})
export default Item
