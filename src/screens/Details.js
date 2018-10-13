import React from 'react'
import {
  StyleSheet,
  Text,
  View,
  Image,
  ListView,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated
} from 'react-native'
import Parallax from './Parallax'
import config from '../../config'

const
  maxWidth = Dimensions.get('window').width,
  {checkout} = require('../shopify')

export default class Details extends React.Component {
  state = {
    localPhoto: null,
    scrollToIndex: 0,
  }

  checkout = e => {
    checkout()
  }

  componentWillReceiveProps(nextProps) {
    const { photo } = nextProps
    if (photo) {
      const scrollToIndex = global.products.findIndex(p => p.id === photo.id)
      this.setState({ localPhoto: photo, scrollToIndex })
    }
  }

  render() {
    const { onClose, openProgress, isAnimating } = this.props
    const { localPhoto } = this.state
    if (localPhoto) {
      return (
        <Animated.View
          style={[StyleSheet.absoluteFill]}
          pointerEvents={isAnimating || this.props.photo ? 'auto' : 'none'}
        >
          <Animated.Image
            ref={r => (this._openingImageRef = r)}
            source={localPhoto.source}
            style={{
              width: maxWidth,
              opacity: openProgress.interpolate({
                inputRange: [0, 0.50, 0.995],
                outputRange: [0, 0.7, 1]
              })
            }}
          />
          <Animated.View
            style={[
              styles.body,
              {
                opacity: openProgress.interpolate({
                  inputRange: [0, 0.50, 0.995],
                  outputRange: [0, .3, 1]
                }),
                transform: [
                  {
                    translateY: openProgress.interpolate({
                      inputRange: [0, 0.99, 0.995],
                      outputRange: [0, 0, 0]
                    })
                  }
                ]
              }
            ]}
          >
            <Parallax scrollToIndex={this.state.scrollToIndex} />
          </Animated.View>
          <Animated.View
            style={{
              position: 'absolute',
              top: 16,
              right: 20,
              opacity: openProgress
            }}
            pointerEvents={isAnimating ? 'none' : 'auto'}
          >
            <TouchableOpacity
              hitSlop={{ top: 20, left: 20, right: 20, bottom: 20 }}
              onPress={() => onClose(localPhoto.id)}
              style={styles.closeButton}
            >
              <View>
                <Text style={styles.closeText}>X</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      )
    }
    return <View />
  }
}

const styles = StyleSheet.create({
  title: {
    color: '#000',
    fontSize: 22,
    fontWeight: '600',
  },
  description: {
    color: '#333',
    fontSize: 14
  },
  body: {
    flex: 1,
  },
  closeText: { fontSize: 17, fontWeight: 'bold', color: '#eee', backgroundColor: 'transparent' },
  closeButton: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    marginTop: 22,
    marginRight: 3,
    borderWidth: 1,
    borderColor: config.light,
    padding: 10,
    paddingTop: 5,
    paddingBottom: 5,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,.7)',
    borderRadius: 100
  },
})
