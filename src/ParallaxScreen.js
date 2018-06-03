import React from 'react'
import { Platform, TouchableWithoutFeedback, Animated, StyleSheet, Image, Text, View, Dimensions } from 'react-native'
import {
  ParallaxSwiper,
  ParallaxSwiperPage
} from "react-native-parallax-swiper"
import { Haptic } from 'expo'
import Message from './Message'
import Drawer from 'react-native-bottom-drawer'
import PHOTOS from './data'

const

  { width, height } = Dimensions.get("window"),
  isDroid = Platform.OS !== 'ios'

export default class App extends React.Component {
  myCustomAnimatedValue = new Animated.Value(0);
  state = {
    scale: new Animated.Value(1),
    isDrawerOpen: false,
    scrollToIndex: 0,
    messages: PHOTOS[0].messages,
  }

  getPageTransformStyle = index => ({
    transform: [
      {
        scale: this.myCustomAnimatedValue.interpolate({
          inputRange: [
            (index - 1) * (width + 8), // Add 8 for dividerWidth
            index * (width + 8),
            (index + 1) * (width + 8)
          ],
          outputRange: [0, 1, 0],
          extrapolate: "clamp"
        })
      },
      {
        rotate: this.myCustomAnimatedValue.interpolate({
          inputRange: [
            (index - 1) * (width + 8),
            index * (width + 8),
            (index + 1) * (width + 8)
          ],
          outputRange: ["180deg", "0deg", "-180deg"],
          extrapolate: "clamp"
        })
      }
    ]
  })

  componentWillUnmount() {
    bus.removeEventListener('photoGalleryClosed')
  }

  componentWillMount() {
    bus.addListener('photoGalleryClosed', _ => this.closeDrawer())
    bus.addListener('photoSelected', photo => {
      const scrollToIndex = PHOTOS.findIndex(p => p.id === photo.id)
      this.setState({scrollToIndex, messages: PHOTOS[scrollToIndex].messages || []})
    })
  }

  openDrawer() {
    this.setState({isDrawerOpen: true, isOnTop: true})
    if (this._drawer) this._drawer.open()
    if (!isDroid) Haptic.notification(Haptic.NotificationTypes.Success)
  }

  closeDrawer() {
    setTimeout(_ => this.setState({isDrawerOpen: false, isOnTop: false}), 100)
    if (this._close) { // guard
      clearTimeout(this._close)
      this._close = null
    } else {
      this._close = setTimeout(_ => this._drawer.close(), 101)
    }
  }

  onStartDrag() {
    this.setState({isOnTop: true})
  }
  onStopDrag() {
    setTimeout(_ => this.setState({isOnTop: this.state.isDrawerOpen ? true : false}), 100)
  }
  onScrollEnd(scrollToIndex) {
    if (scrollToIndex === this.state.scrollToIndex) return // guard
    if (this._endTimer) clearTimeout(this._endTimer) // cancel
    this.setState({scrollToIndex, messages: PHOTOS[scrollToIndex].messages || []})
    Animated.spring(this.state.scale, {
      toValue: 1,
      velocity: 1.5,
      bounciness: .1,
    }).start()
    if (!isDroid)
      this._endTimer =
        setTimeout(_ =>
          Haptic.impact(Haptic.ImpactStyles.Light), 5)
  }
  onPress() {
    if (!this.state.isDrawerOpen) {
      this.openDrawer()
    } else {
      if (!isDroid) Haptic.selection()
      if (this.state.isDrawerOpen && global.scrollDrawerBottom) global.scrollDrawerBottom()
      this.setState({messages: this.state.messages.concat({key: Math.random(), from: 'keith', msg: 'Pressed!  The next piece to this story would be. right. here.', right: true})})
    }
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <View>
          <ParallaxSwiper
            speed={0.4}
            animatedValue={this.myCustomAnimatedValue}
            dividerWidth={8}
            dividerColor="black"
            backgroundColor="black"
            onMomentumScrollEnd={i => this.onScrollEnd(i)}
            showsHorizontalScrollIndicator={false}
            progressBarThickness={0}
            showProgressBar={false}
            scrollToIndex={this.state.scrollToIndex}
            progressBarBackgroundColor="rgba(0,0,0,0.25)"
            progressBarValueBackgroundColor="#000"
          >
            {PHOTOS.map((photo, ndx) =>
              (
                <ParallaxSwiperPage key={photo.id + 'page'}
                    BackgroundComponent={
                        <Image
                            style={styles.backgroundImage}
                            source={{ uri: photo.source.uri }}
                            />
                          }
                          ForegroundComponent={
                              <View key={photo.id} style={[styles.foregroundTextContainer]}>
                                  {this.state.isDrawerOpen
                                    ? null
                                    : <Animated.View style={[this.getPageTransformStyle(ndx)]}>
                                        <TouchableWithoutFeedback onPress={_ => this.openDrawer()}>
                                          <View>
                                            <Text style={[styles.foregroundText, photo.isDark ? styles.dark : null]}>{photo.title.toUpperCase()}</Text>
                                            <Text style={[styles.authorText, photo.isDark ? styles.dark : null]}>{photo.postedBy.toUpperCase()}</Text>
                                          </View>
                                        </TouchableWithoutFeedback>
                                      </Animated.View>
                                  }
                            </View>
                          }
                />
            ))}
          </ParallaxSwiper>
        </View>
<Animated.View style={[{transform: [{scale: this.state.scale}]}, this.state.isOnTop ? {...StyleSheet.absoluteFillObject} : {...StyleSheet.absoluteFillObject, top: height - 100}]}>
          <Drawer
            onPress={_ => this.onPress()}
            ref={r => this._drawer = r}
            onOpen={_ => this.setState({isDrawerOpen: true})}
            onClose={_ => this.closeDrawer()}
            onStartDrag={_ => this.onStartDrag()}
            onStopDrag={_ => this.onStopDrag()}
            headerHeight={80}
            teaserHeight={70}
            header={'STORIES'}>
            {this.state.messages.map(m => <Message {...m} onPress={_ => this.onPress()}/>)}
          </Drawer>
        </Animated.View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundImage: {
    width,
    height,
  },
  foregroundTextContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    position: 'absolute',
    bottom: 85,
    left: 20,
  },
  foregroundText: {
    flex: 1,
    flexDirection: 'row',
    marginRight: 25,
    fontSize: 34,
    fontWeight: "700",
    letterSpacing: 0.41,
    color: "white"
  },
  authorText: {
    fontSize: 20,
    marginTop: 8,
    color: 'rgba(255,255,255,.8)',
  },
  dark: {
    color: 'rgba(0,0,0,.8)',
  },
  downArrow: {
    color: '#eee',
  }
})
