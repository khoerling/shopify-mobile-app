import React from 'react';
import { Platform, TouchableWithoutFeedback, Animated, StyleSheet, Image, Text, View, Dimensions } from 'react-native';
import {
  ParallaxSwiper,
  ParallaxSwiperPage
} from "react-native-parallax-swiper"
import { Haptic } from 'expo'
import Message from './Message'
import Drawer from 'react-native-bottom-drawer'

const
  { width, height } = Dimensions.get("window"),
  isDroid = Platform.OS !== 'ios'
  stories = [
  {messages: [
    {key: 1, from: 'ben', msg: 'YO\nIt\'s Ben'},
    {key: 2, from: 'keith', msg: 'Waddddap!', right: true},
    {key: 3, from: 'keith', msg: 'Give this demo a spin and let me know your thoughts.  Likely a 2-column screen would exist in our navigation before this one, similar to Hooked, whereby pressing a Story loads this screen with the left/right swipes between Stories.\n\nSwipe up or press on these messages to show the next message, btw...', right: true},
    {key: 4, from: 'ben', msg: 'ok!!'},
    ]
  },
  {messages: [
    {key: 1, from: 'keith', msg: 'The man in black fled across the Desert, and the Gunslinger followed.'},
  ]},
  {messages: [
    {key: 1, from: 'keith', msg: 'a 3rd story begins...\n'},
    {key: 2, from: 'ben', msg: 'test, test, test, test, test, test, test, test, test, test, test, test...'},
  ]},
]

export default class App extends React.Component {
  myCustomAnimatedValue = new Animated.Value(0);
  state = {
    scale: new Animated.Value(1),
    isDrawerOpen: false,
    scrollToIndex: null,
    messages: stories[0].messages,
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

  openDrawer() {
    this.setState({isDrawerOpen: true, isOnTop: true})
    if (this._drawer) this._drawer.open()
    if (!isDroid) Haptic.notification(Haptic.NotificationTypes.Success)
  }

  closeDrawer() {
    setTimeout(_ => this.setState({isDrawerOpen: false, isOnTop: false}), 100)
  }

  onStartDrag() {
    this.setState({isOnTop: true})
  }
  onStopDrag() {
    setTimeout(_ => this.setState({isOnTop: this.state.isDrawerOpen ? true : false}), 100)
  }
  onScrollEnd(scrollToIndex) {
    if (scrollToIndex === this.state.scrollToIndex) return // guard
    if (this._endTimer) clearTimeout(this._endTimer)
    if (this._endTimer) clearTimeout(this._endTimer) // cancel
    this._endTimer = setTimeout(_ => { // yield
      if (!isDroid) Haptic.impact(scrollToIndex !== this.state.scrollToIndex ? Haptic.ImpactStyles.Light : Haptic.ImpactStyles.Heavy)
      this.setState({scrollToIndex, messages: stories[scrollToIndex].messages })
      Animated.spring(this.state.scale, {
        toValue: 1,
        velocity: 1.5,
        bounciness: .1,
      }).start()
    }, 10)
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
            showsHorizontalScrollIndicator={true}
            progressBarThickness={0}
            showProgressBar={false}
            scrollToIndex={this.state.scrollToIndex}
            progressBarBackgroundColor="rgba(0,0,0,0.25)"
            progressBarValueBackgroundColor="#000"
          >
            <ParallaxSwiperPage
              BackgroundComponent={
                <Image
                  style={styles.backgroundImage}
                  source={{ uri: "https://goo.gl/wtHtxG" }}
                />
              }
              ForegroundComponent={
                <View style={[styles.foregroundTextContainer]}>
                    {this.state.isDrawerOpen
                      ? null
                      : <Animated.View style={[this.getPageTransformStyle(0)]}>
                          <TouchableWithoutFeedback onPress={_ => this.openDrawer()}>
                          <View>
                              <Text style={[styles.foregroundText, styles.dark]}>STORY ONE</Text>
                              <Text style={[styles.authorText, styles.dark]}>AUTHOR</Text>
                            </View>
                          </TouchableWithoutFeedback>
                        </Animated.View>
                    }
                </View>
              }
            />
            <ParallaxSwiperPage
              BackgroundComponent={
                <Image
                  style={styles.backgroundImage}
                  source={{ uri: "https://goo.gl/gt4rWa" }}
                />
              }
              ForegroundComponent={
                <View style={styles.foregroundTextContainer}>
                  {this.state.isDrawerOpen
                    ? null
                    : <Animated.View style={[this.getPageTransformStyle(1)]}>
                        <TouchableWithoutFeedback onPress={_ => this.openDrawer()}>
                          <View>
                            <Text style={[styles.foregroundText]}>STORY TWO</Text>
                            <Text style={[styles.authorText]}>AUTHOR</Text>
                          </View>
                        </TouchableWithoutFeedback>
                      </Animated.View>
                  }
                </View>
              }
            />
            <ParallaxSwiperPage
              BackgroundComponent={
                <Image
                  style={styles.backgroundImage}
                  source={{ uri: "https://goo.gl/KAaVXt" }}
                />
              }
              ForegroundComponent={
                <View style={styles.foregroundTextContainer}>
                  {this.state.isDrawerOpen
                    ? null
                    : <Animated.View style={[this.getPageTransformStyle(2)]}>
                        <TouchableWithoutFeedback onPress={_ => this.openDrawer()}>
                          <View>
                            <Text style={[styles.foregroundText]}>STORY THREE</Text>
                            <Text style={[styles.authorText]}>AUTHOR</Text>
                          </View>
                        </TouchableWithoutFeedback>
                      </Animated.View>
                    }
                </View>
              }
            />
          </ParallaxSwiper>
        </View>
        <Animated.View style={[{transform: [{scale: this.state.scale}]}, this.state.isOnTop ? {...StyleSheet.absoluteFillObject} : null]}>
          <Drawer
            onPress={_ => this.onPress()}
            ref={r => this._drawer = r}
            onOpen={_ => this.setState({isDrawerOpen: true})}
            onClose={_ => this.closeDrawer()}
            onStartDrag={_ => this.onStartDrag()}
            onStopDrag={_ => this.onStopDrag()}
            headerHeight={80}
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
});
