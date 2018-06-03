import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ListView,
  Dimensions,
  TouchableOpacity,
  Animated
} from 'react-native';
import ParallaxScreen from './ParallaxScreen'

const maxWidth = Dimensions.get('window').width;

export default class DetailScreen extends React.Component {
  state = {
    localPhoto: null
  };

  componentWillReceiveProps(nextProps) {
    const { photo } = nextProps;
    if (photo) {
      this.setState({ localPhoto: photo });
    }
  }

  render() {
    const { onClose, openProgress, isAnimating } = this.props;
    const { localPhoto } = this.state;
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
            <ParallaxScreen />
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
              hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
              onPress={() => onClose(localPhoto.id)}
              style={styles.closeButton}
            >
              <Text style={styles.closeText}>X</Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      );
    }
    return <View />;
  }
}

const styles = StyleSheet.create({
  title: {
    color: '#000',
    fontSize: 22,
    fontWeight: '600',
    lineHeight: 50
  },
  description: {
    color: '#333',
    fontSize: 14
  },
  body: { flex: 1, },
  closeText: { color: '#eee', backgroundColor: 'transparent' },
  closeButton: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    marginTop: 20,
    marginRight: 3,
    borderWidth: 1,
    borderColor: 'white',
    padding: 10,
    paddingTop: 5,
    paddingBottom: 5,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,.7)',
    borderRadius: 100
  }
});
