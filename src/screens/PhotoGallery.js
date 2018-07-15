import React from 'react'
import { Platform, Easing, Text, View, Animated } from 'react-native'
import { Haptic } from 'expo'
import PropTypes from 'prop-types'

import Transition from '../Transition'
import Details from './Details'

const isDroid = Platform.OS !== 'ios'

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

  open = photo => {
    if (!isDroid) Haptic.selection()
    this.setState({ photo, isAnimating: false })
    this.state.openProgress.setValue(1) // immediately open
    bus.emit('itemSelected', photo) // photo is the full item
  }

  close = photoId => {
    this.setState({ photo: null, isAnimating: true }, () => {
      bus.emit('photoGalleryClosed', photoId)
      Animated.timing(this.state.openProgress, {
        toValue: 0,
        duration: 400,
        easing: Easing.inOut(Easing.cubic),
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
      <View style={{ flex: 1 }}>
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
      </View>
    )
  }
}
