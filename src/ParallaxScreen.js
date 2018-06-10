import React from 'react'
import { StatusBar, Platform, TouchableWithoutFeedback, Animated, StyleSheet, Image, Text, View, Dimensions } from 'react-native'
import {
  ParallaxSwiper,
  ParallaxSwiperPage
} from "react-native-parallax-swiper"
import { Haptic } from 'expo'
import Message from './Message'
import Drawer from 'react-native-bottom-drawer'
import PHOTOS from './data'
import { BlurView } from 'expo'

const
  { width, height } = Dimensions.get("window"),
  isDroid = Platform.OS !== 'ios'

export default class App extends React.Component {
  myCustomAnimatedValue = new Animated.Value(0);
  state = {
    scale: new Animated.Value(1),
    isDrawerOpen: false,
    scrollToIndex: this.props.scrollToIndex || 0,
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
          outputRange: [-.7, 1, -.7],
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
      this.lastSelected = new Date()
      this.setState({scrollToIndex, messages: PHOTOS[scrollToIndex].messages || []})
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
      this._close= setTimeout(_ => {
        this.setState({isOnTop: false})
        this._drawer.close()
      }, 650)
    }
    StatusBar.setHidden(false, true) // show
  }

  onStartDrag() {
    this.setState({isOnTop: true})
    StatusBar.setHidden(true, true) // hide & show
  }
  onStopDrag() {
    setTimeout(_ => this.setState({isOnTop: this.state.isDrawerOpen ? true : false}), 100)
    StatusBar.setHidden(!this.state.isDrawerOpen, false) // hide & show
  }

  onScrollBegin(scrollToIndex) {
    if (this._endTimer) clearTimeout(this._endTimer)
  }
  onScrollEnd(scrollToIndex) {
    if (this._endTimer) clearTimeout(this._endTimer)
    if (scrollToIndex === this.state.scrollToIndex) return // guard
    this._endTimer =
      setTimeout(_ => {
        this.setState({scrollToIndex, messages: PHOTOS[scrollToIndex].messages || []})
        Animated.spring(this.state.scale, {
          toValue: 1,
          velocity: 1.5,
          bounciness: .1,
        }).start()
        if (!isDroid) Haptic.impact(Haptic.ImpactStyles.Light)
      }, 351)
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
            speed={0.3}
            animatedValue={this.myCustomAnimatedValue}
            dividerWidth={8}
            dividerColor="black"
            backgroundColor="black"
            onMomentumScrollEnd={i => this.onScrollEnd(i)}
            onScrollBeginDrag={i => this.onScrollBegin(i)}
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
                              <BlurView intensity={40} key={photo.id} style={[styles.foregroundTextContainer, {opacity: this.state.isDrawerOpen ? 0 : 1}]}>
                                  {this.state.isDrawerOpen
                                    ? null
                                    : <Animated.View style={[this.getPageTransformStyle(ndx),

                                                             {
                                                               opacity: this.myCustomAnimatedValue.interpolate({
                                                                 inputRange: [
                                                                   (ndx - 1) * (width + 8), // Add 8 for dividerWidth
                                                                   ndx * (width + 8),
                                                                   (ndx + 1) * (width + 8)
                                                                 ],
                                                                 outputRange: [-.7, 1, -.7],
                                                               }),
                                                             },
                                                            ]}>
                                        <TouchableWithoutFeedback onPress={_ => this.openDrawer()}>
                                          <View>
                                            <Text style={[styles.foregroundText, photo.theme ? styles[photo.theme] : null]}>{photo.title.toUpperCase()}</Text>
                                            <Text style={[styles.authorText, photo.theme ? styles[photo.theme] : null]}>{photo.postedBy.toUpperCase()}</Text>
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
<Animated.View style={[{transform: [{scale: this.state.scale}]}, this.state.isOnTop ? {...StyleSheet.absoluteFillObject} : {...StyleSheet.absoluteFillObject, top: height - 100}]}>
          <Drawer
            onPress={_ => this.onPress()}
            ref={r => this._drawer = r}
            onOpen={_ => this.setState({isDrawerOpen: true})}
            onClose={_ => this.closeDrawer()}
            onStartDrag={_ => this.onStartDrag()}
            onStopDrag={_ => this.onStopDrag()}
            headerHeight={90}
            teaserHeight={70}
            headerIcon={'md-arrow-back'}
            header={''}>
            {this.state.messages.map(m =>
              <Message {...m}
                theme={PHOTOS[this.state.scrollToIndex].theme}
                onPress={_ => this.onPress()}/>)}
            <View style={{marginTop: 200}}/>
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
    alignItems: "flex-start",
    justifyContent: "center",
    backgroundColor: "transparent",
    position: 'absolute',
    bottom: 0,
    paddingBottom: 90,
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
