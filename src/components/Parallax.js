import React from 'react'
import { StatusBar, Platform, PanResponder, TouchableWithoutFeedback, Animated, StyleSheet, Image, Text, View, Dimensions } from 'react-native'
import { ParallaxSwiper, ParallaxSwiperPage } from "react-native-parallax-swiper"
import { Haptic } from 'expo'
import Counter from './../components/Counter'

import config from '../../config'
import { get, set } from './../storage'

const
  cart = require('../api/cart'),
  color = require('color'),
  { width, height } = Dimensions.get("window"),
  isDroid = Platform.OS !== 'ios',
  dividerWidth = 1

const Attributes = ({item}) =>
  <View style={styles.attributes}>
    {item.attributes.map(a => {
      if (!a) return null // guard
      const [name, value] = a.split(' ')
      return <View key={a} style={styles.attribute}>
        <View style={styles.attributeBubble}>
          <Text style={styles.attributeName}>{name}</Text>
        </View>
        <View style={styles.attributeValue}><Text>{value}</Text></View>
      </View>
    })}
  </View>

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
            (index - 1) * (width + dividerWidth), // Add dividerWidth
            index * (width + dividerWidth),
            (index + 1) * (width + dividerWidth)
          ],
          outputRange: [-.8, 1, -.8],
          extrapolate: "clamp"
        })
      },
      {
        rotate: this.swipeAnimatedValue.interpolate({
          inputRange: [
            (index - 1) * (width + dividerWidth),
            index * (width + dividerWidth),
            (index + 1) * (width + dividerWidth)
          ],
          outputRange: ["80deg", "0deg", "-80deg"],
          extrapolate: "clamp"
        })
      }
    ]
  })

  item = _ => global.products[this.state.scrollToIndex]

  componentWillUnmount() {
    global.bus.removeEventListener('photoGalleryClosed') // cleanup
    this.saveMessageIndex()
  }

  async componentWillMount() {
    global.bus.addListener('photoGalleryClosed', _ => setTimeout(_ => this.closeDrawer(), this.animationTimeout))
    global.bus.addListener('itemSelected', async item => {
      const scrollToIndex = global.products.findIndex(d => d.id === item.id)
      this.setState({
        // restore read-point & index
        scrollToIndex,
      })
    })
  }

  openDrawer() {
    // if (this._close) {
    //   // cancel close
    //   clearTimeout(this._close)
    //   this._close = null
    // }
    // this.setState({isDrawerOpen: true, isOnTop: true})
    // if (!isDroid) Haptic.notification(Haptic.NotificationTypes.Success)
    // StatusBar.setHidden(true, false) // hide
  }

  closeDrawer() {
    // this.setState({isDrawerOpen: false})
    // if (this._close) { // guard
    //   clearTimeout(this._close)
    //   this._close = null
    // } else {
    //   this._close= setTimeout(_ =>
    //     this.setState({isOnTop: false}),
    //     this.animationTimeout)
    // }
    // StatusBar.setHidden(false, true) // show
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
        global.bus.emit('itemSelected', this.item())
        Animated.spring(this.state.scale, {
          toValue: 1,
          velocity: 5,
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

  counterPressed(product, count) {
    product.qty = count
    cart.upsertItem(product)
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <ParallaxSwiper
          speed={0.2}
          animatedValue={this.swipeAnimatedValue}
          dividerWidth={dividerWidth}
          dividerColor={config.accent}
          backgroundColor={config.light}
          onMomentumScrollEnd={i => this.onScrollEnd(i)}
          onScrollBeginDrag={i => this.onScrollBegin(i)}
          showsHorizontalScrollIndicator={false}
          progressBarThickness={2}
          showProgressBar={true}
          scrollToIndex={this.state.scrollToIndex}
          progressBarBackgroundColor="rgba(255,255,255,0.25)"
          progressBarValueBackgroundColor={config.accent}>
          {global.products.map((item, ndx) =>
            (
              <ParallaxSwiperPage key={item.id + 'page'}
                BackgroundComponent={
                  <Image
                    style={styles.backgroundImage}
                    source={{ uri: item.source.uri }} />
                }
                ForegroundComponent={
                  <View key={item.id} style={[styles.foregroundTextContainer, {opacity: this.state.isDrawerOpen ? 0 : 1}]}>
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
                            <View style={{paddingHorizontal: 20}}>
                              <Attributes item={item} />
                              <Animated.View style={[{transform: [{scale: this.state.scale}]}]}>
                                <Counter counter={item.qty} onPress={c => this.counterPressed(item, c)} />
                              </Animated.View>
                              <View style={styles.textContainer}>
                                <Text style={[styles.foregroundText]}>{item.title.toUpperCase()}</Text>
                                {0 && <Text style={[styles.description, {flex: 1}]}>{item.description}</Text>}
                                <Text style={[styles.description, styles.ingredients]}>{item.ingredients}</Text>
                              </View>
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
    )
  }
}

const styles = StyleSheet.create({
  textContainer: {
    flex: 1,
    alignSelf: 'flex-end',
  },
  backgroundImage: {
    width,
    height: height - 100,
    marginTop: -175,
  },
  foregroundTextContainer: {
    flex: 1,
    alignItems: "flex-start",
    backgroundColor: "transparent",
    position: 'absolute',
    bottom: 0,
    paddingBottom: 15 + config.checkoutButtonHeight,
    paddingTop: 15,
    height: 400,
    left: 0,
    right: 0,
  },
  foregroundText: {
    marginTop: 10,
    fontSize: 25,
    lineHeight: 32,
    textAlign: 'justify',
    fontWeight: "700",
    letterSpacing: 0.41,
    color: config.dark,
  },
  description: {
    textAlign: 'justify',
    lineHeight: 20,
    fontSize: 15,
    letterSpacing: -1,
    fontWeight: '400',
    color: color(config.dark).fade(.3),
  },
  ingredients: {
    textAlign: 'justify',
    fontSize: 10,
    lineHeight: 12,
    fontWeight: 'bold',
    paddingTop: 5,
    color: color(config.dark).fade(.5),
  },
  attributes: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  attribute: {
    height: 85,
  },
  attributeBubble: {
    backgroundColor: color(config.light).fade(.5),
    borderRadius: 100,
    margin: 5,
    padding: 12,
  },
  attributeName: {
    color: config.dark,
    fontWeight: 'bold',
    justifyContent: 'center',
    alignItems: 'center',
  },
  attributeValue: {
    color: color(config.dark).fade(.35),
    fontWeight: 'bold',
    letterSpacing: -1,
    flex: 1,
    textAlign: 'center',
  }
})
