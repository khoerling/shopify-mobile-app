import React from 'react'
import { StatusBar, Platform, PanResponder, TouchableWithoutFeedback, Animated, StyleSheet, Image, Text, View, Dimensions } from 'react-native'
import { ParallaxSwiper, ParallaxSwiperPage } from "react-native-parallax-swiper"
import { Haptic } from 'expo'
import { BlurView } from 'expo'

import Message from './Message'
import { get, set } from './storage'

const
  { width, height } = Dimensions.get("window"),
  isDroid = Platform.OS !== 'ios'

export default class App extends React.Component {
  animationTimeout = 100
  swipeAnimatedValue = new Animated.Value(0)
  state = {
    buildInLastMessage: new Animated.Value(1),
    scale: new Animated.Value(1),
    isDrawerOpen: false,
    scrollToIndex: this.props.scrollToIndex || 0,
  }

  getPageTransformStyle = index => ({
    transform: [
      {
        scale: this.swipeAnimatedValue.interpolate({
          inputRange: [
            (index - 1) * (width + 8), // Add 8 for dividerWidth
            index * (width + 8),
            (index + 1) * (width + 8)
          ],
          outputRange: [-.8, 1, -.8],
          extrapolate: "clamp"
        })
      },
      {
        rotate: this.swipeAnimatedValue.interpolate({
          inputRange: [
            (index - 1) * (width + 8),
            index * (width + 8),
            (index + 1) * (width + 8)
          ],
          outputRange: ["80deg", "0deg", "-80deg"],
          extrapolate: "clamp"
        })
      }
    ]
  })

  item = _ => global.products[this.state.scrollToIndex]

  componentWillUnmount() {
    bus.removeEventListener('photoGalleryClosed') // cleanup
    this.saveMessageIndex()
  }

  async componentWillMount() {
    bus.addListener('photoGalleryClosed', _ => setTimeout(_ => this.closeDrawer(), this.animationTimeout))
    bus.addListener('itemSelected', async item => {
      const scrollToIndex = global.products.findIndex(d => d.id === item.id)
      this.setState({
        // restore read-point & index
        scrollToIndex,
      })
    })
  }

  openDrawer() {
    if (this._close) {
      // cancel close
      clearTimeout(this._close)
      this._close = null
    }
    this.setState({isDrawerOpen: true, isOnTop: true})
    if (this._drawer) this._drawer.open()
    if (!isDroid) Haptic.notification(Haptic.NotificationTypes.Success)
    StatusBar.setHidden(true, false) // hide
  }

  closeDrawer() {
    this.setState({isDrawerOpen: false})
    if (this._close) { // guard
      clearTimeout(this._close)
      this._close = null
    } else {
      this._close= setTimeout(_ =>
        this.setState({isOnTop: false}),
        this.animationTimeout)
    }
    StatusBar.setHidden(false, true) // show
  }

  onStartDrag() {
    this.setState({isOnTop: true})
    StatusBar.setHidden(true, true) // hide & show
  }
  onStopDrag() {
    setTimeout(_ => this.setState({isOnTop: this.state.isDrawerOpen ? true : false}), this.animationTimeout)
    StatusBar.setHidden(!this.state.isDrawerOpen, false) // hide & show
  }

  onScrollBegin(scrollToIndex) {
    if (this._endTimer) clearTimeout(this._endTimer)
  }
  onScrollEnd(scrollToIndex) {
    if (this._endTimer) clearTimeout(this._endTimer)
    if (scrollToIndex === this.state.scrollToIndex) return false
    if (scrollToIndex === this.lastScrollToIndex) return false
    this.lastScrollToIndex = scrollToIndex
    this._endTimer =
      setTimeout(_ => {
        // update index and bounce bottom-drawer teaser in
        this.setState({scrollToIndex})
        bus.emit('itemSelected', this.item())
        Animated.spring(this.state.scale, {
          toValue: 1,
          velocity: 1.5,
          bounciness: .1,
        }).start()
        if (!isDroid) Haptic.impact(Haptic.ImpactStyles.Light)
      }, 150)
  }
  async onPress(params) {
    if (!this.state.isDrawerOpen) {
      this.openDrawer()
    }
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <ParallaxSwiper
          speed={0.2}
          animatedValue={this.swipeAnimatedValue}
          dividerWidth={8}
          dividerColor={config.accent}
          backgroundColor="#fff"
          onMomentumScrollEnd={i => this.onScrollEnd(i)}
          onScrollBeginDrag={i => this.onScrollBegin(i)}
          showsHorizontalScrollIndicator={false}
          progressBarThickness={0}
          showProgressBar={false}
          scrollToIndex={this.state.scrollToIndex}
          progressBarBackgroundColor="rgba(0,0,0,0.25)"
          progressBarValueBackgroundColor="#000">
          {global.products.map((item, ndx) =>
            (
              <ParallaxSwiperPage key={item.id + 'page'}
                BackgroundComponent={
                  <Image
                    style={styles.backgroundImage}
                    source={{ uri: item.source.uri }} />
                }
                ForegroundComponent={
                  <BlurView intensity={65} key={item.id} style={[styles.foregroundTextContainer, {opacity: this.state.isDrawerOpen ? 0 : 1}]}>
                    {this.state.isDrawerOpen
                      ? null
                      : <Animated.View
                          style={[
                            this.getPageTransformStyle(ndx),
                            {
                              opacity: this.swipeAnimatedValue.interpolate({
                                inputRange: [
                                  (ndx - 1) * (width + 8), // Add 8 for dividerWidth
                                  ndx * (width + 8),
                                  (ndx + 1) * (width + 8)
                                ],
                                outputRange: [-2, 1, -2],
                              }),
                            },
                          ]}>
                          <TouchableWithoutFeedback onPress={_ => this.openDrawer()}>
                            <View>
                              <Text style={[styles.foregroundText]}>{item.title.toUpperCase()}</Text>
                            </View>
                          </TouchableWithoutFeedback>
                        </Animated.View>
                    }
                  </BlurView>
                }
              />
            ))}
          </ParallaxSwiper>
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
    alignItems: "flex-start",
    justifyContent: "center",
    backgroundColor: "transparent",
    position: 'absolute',
    bottom: 0,
    paddingBottom: 25,
    paddingTop: 15,
    paddingLeft: 25,
    left: 0,
    right: 0,
  },
  foregroundText: {
    flex: 1,
    flexDirection: 'row',
    marginRight: 25,
    fontSize: 34,
    lineHeight: 32,
    fontWeight: "700",
    letterSpacing: 0.41,
    color: "white"
  },
  abstractText: {
    fontSize: 13,
    fontWeight: '400',
    paddingRight: 25,
    color: 'rgba(255,255,255,.85)',
  },
  authorText: {
    fontSize: 14,
    marginTop: 5,
    fontWeight: "700",
    color: 'rgba(255,255,255,.85)',
  },
  dark: {
    color: 'rgba(0,0,0,.8)',
  },
  downArrow: {
    color: '#eee',
  }
})
