import React from 'react'
import { Platform, Easing, Text, View, Animated } from 'react-native'
import { Haptic } from 'expo'
import PropTypes from 'prop-types'
import { graphql, compose, ApolloProvider } from 'react-apollo'
import gql from 'graphql-tag'

import Transition from './Transition'
import DetailScreen from './DetailScreen'

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

const PhotoGallery = class PhotoGallery extends React.Component {
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
    bus.addListener('storySelected', photo => {
      this.setState({photo})
    })
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
    bus.emit('storySelected', photo)    // photo is the full story
  }

  close = photoId => {
    this.setState({ photo: null, isAnimating: true }, () => {
      bus.emit('photoGalleryClosed', photoId)
      Animated.timing(this.state.openProgress, {
        toValue: 0,
        duration: 300,
        easing: Easing.easeInExpo,
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
        <DetailScreen
          photo={photo}
          onClose={this.close}
          openProgress={openProgress}
          isAnimating={isAnimating}
        />
        <Text style={{position: 'absolute', top: 50, backgroundColor: 'rgba(0,0,0,.5)', color: '#fff'}}>{js(this.props.data.shop)}</Text>
      </View>
    )
  }
}

const simple = gql`
query {
  shop {
    name
    primaryDomain {
      url
      host
    }
  }
}
`

export default compose(
  graphql(simple),
)(PhotoGallery);
