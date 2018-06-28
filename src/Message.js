import React from 'react'
import {
  Text,
  Clipboard,
  StyleSheet,
  TouchableWithoutFeedback,
  Animated,
  View,
  ViewPropTypes,
  Platform,
} from 'react-native'

export default class Message extends React.Component {
  render() {
    const {item, theme, style, onPress} = this.props
    if (!item) return <View style={{height: 20}}></View> // guard
    return (
      <TouchableWithoutFeedback onPress={_ => onPress()}>
        {item.from === 'narration'
          ? <Animated.View style={[{flex: 1, justifyContent: 'center'}, style ? style : null]}>
              <Text
                selectable={true}
                style={[
                  styles.narration,
                  theme ? styles[`${theme}Narration`] : null]}>
                {item.msg}
              </Text>
            </Animated.View>
          : <Animated.View style={[
              styles.container,
              item.adjacent ? styles.adjacent : null,
              item.right ? styles.containerRight : null,
              style ? style : null,
              item.abstract ? styles.abstract : null,
              theme ? styles[`${theme}Container`] : null,
              item.abstract ? styles[`${theme}Abstract`] : null]}>
              {item.adjacent
                ? null
                : item.from
                  ? <Text
                      selectable={true}
                      style={[
                        styles.from,
                        item.right ? styles.right : null,
                        theme ? styles[`${theme}${item.right ? 'Right' : ''}From`] : null,
                        ]}>
                        {item.from}
                    </Text>
                  : null}
              <Text
                selectable={true}
                style={[
                  styles.body,
                  theme ? styles[`${theme || ''}Body`] : null,
                  item.right ? styles.bodyRight : null,
                  item.abstract ? styles[`${theme || ''}AbstractText`] : null]}>
                  {item.msg || item.abstract}
              </Text>
            </Animated.View>
        }
      </TouchableWithoutFeedback>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,.94)',
    padding: 8,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginTop: 10,
    marginHorizontal: 7,
  },
  abstract: {
    // backgroundColor: 'rgba(255,255,255,.3)',
    backgroundColor: 'transparent',
    minHeight: 90,
  },
  darkAbstract: {
    // backgroundColor: 'rgba(250,250,250,.5)',
    backgroundColor: 'transparent',
    minHeight: 90,
  },
  darkAbstractText: {
    fontSize: 16,
    color: 'rgba(0,0,0,.8)',
  },
  AbstractText: {
    fontSize: 16,
    color: 'rgba(255,255,255,.8)',
  },
  adjacent: {
    marginTop: 2,
  },
  darkNarration: {
    color: '#aaa',
  },
  narration: {
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'rgba(255,255,255,.9)',
    marginVertical: 20,
    marginBottom: 30,
    marginHorizontal: 25,
  },
  bodyRight: {
    fontSize: 17,
  },
  body: {
    fontSize: 18,
  },
  darkContainer: {
    backgroundColor: 'rgba(50,50,50,.94)',
  },
  darkBody: {
    color: '#eee',
  },
  darkRightFrom: {
    color: 'orange',
  },
  darkFrom: {
    color: 'red',
  },
  darkRight: {
    color: "#aaa",
  },
  right: {
    alignSelf: 'flex-end',
    color: "#333",
  },
  from: {
    fontWeight: "bold",
    color: 'green',
    opacity: .8,
    fontSize: 13,
    marginBottom: 5,
  }
})
