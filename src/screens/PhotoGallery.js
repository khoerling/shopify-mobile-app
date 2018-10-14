import React from 'react'
import { Platform, Easing, Text, View, Animated, TouchableWithoutFeedback, StyleSheet } from 'react-native'
import { Haptic } from 'expo'
import PropTypes from 'prop-types'

import config from '../../config'
import Transition from '../components/Transition'
import Details from './Details'

const
  isDroid = Platform.OS !== 'ios',
  shopify = require('../shopify')

class PhotoGalleryPhoto extends React.Component {
  state = {
    opacity: 1
  }

  static contextTypes = {
    onImageRef: PropTypes.func
  }

  setOpacity = opacity => {
    this.setState({ opacity })
  }

  render() {
    const { style, photo } = this.props
    const { opacity } = this.state
    return (
      <Animated.Image
        ref={i => {
          this.context.onImageRef(photo, i, this.setOpacity)
        }}
        style={[
          style,
          {
            opacity
          }
        ]}
        source={photo.source}
      />
    )
  }
}

export default PhotoGallery = class PhotoGallery extends React.Component {
  static Photo = PhotoGalleryPhoto

  state = {
    photo: null,
    openProgress: new Animated.Value(0),
    isAnimating: false
  }

  _images = {}

  _imageOpacitySetters = {}

  static childContextTypes = {
    onImageRef: PropTypes.func
  }

  componentWillMount() {
    this._updatePhoto = photo => {
      this.setState({photo})
    }
    bus.addListener('itemSelected', this._updatePhoto)
  }
  componentWillUnmount() {
    bus.removeListener('itemSelected', this._updatePhoto)
  }
  getChildContext() {
    return { onImageRef: this._onImageRef }
  }

  _onImageRef = (photo, imageRef, setOpacity) => {
    this._images[photo.id] = imageRef
    this._imageOpacitySetters[photo.id] = setOpacity
  }

  checkout = _ => {
    shopify.checkout()
  }

  open = photo => {
    if (!isDroid) Haptic.selection()
    this._imageOpacitySetters[photo.id](
      this.state.openProgress.interpolate({
        inputRange: [0.005, 0.999],
        outputRange: [1, 0]
      })
    )
    this.setState({ photo, isAnimating: false })
    // this.state.openProgress.setValue(1) // immediately open
    setTimeout(_ => {
      Animated.timing(this.state.openProgress, {
        toValue: 1,
        duration: 150,
        easing: Easing.easeInCubic,
        useNativeDriver: true
      }).start(() => {
        this.setState({ isAnimating: false })
      })
    }, 50) // FIXME yield to load photo -- use cb, or... ?
    bus.emit('itemSelected', photo) // photo is the full item
  }

  close = photoId => {
    this.setState({ photo: null, isAnimating: true }, () => {
      bus.emit('photoGalleryClosed', photoId)
      Animated.timing(this.state.openProgress, {
        toValue: 0,
        duration: 375,
        easing: Easing.easeOutCubic,
        useNativeDriver: true
      }).start(() => {
        this._imageOpacitySetters[photoId](1)
        this.setState({ isAnimating: false })
      })
    })
  }

  render() {
    const { photo, openProgress, isAnimating } = this.state
    return (
      <View style={{ flex: 1, marginBottom: config.checkoutButtonHeight }}>
        {this.props.renderContent({ onPhotoOpen: this.open })}
        <Transition
          openProgress={openProgress}
          photo={photo}
          sourceImageRefs={this._images}
          isAnimating={isAnimating}
        />
        <Details
          photo={photo}
          onClose={this.close}
          openProgress={openProgress}
          isAnimating={isAnimating}
        />
        <TouchableWithoutFeedback onPress={this.checkout}>
          <View style={styles.checkoutButton}>
            <Text style={styles.checkoutText}>CHECKOUT</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  checkoutButton: {
    backgroundColor: config.accent,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: -(config.checkoutButtonHeight),
    height: config.checkoutButtonHeight,
    left: 0,
    right: 0,
  },
  checkoutText: {
    ...config.bold,
    fontSize: 20,
    color: config.light,
    marginTop: -20,
  },
})
