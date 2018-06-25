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
    return (
      <TouchableWithoutFeedback onPress={_ => this.props.onPress()}>
        {this.props.item.from === 'narration'
          ? <Animated.View style={[{flex: 1, justifyContent: 'center'}, this.props.style ? this.props.style : null]}>
              <Text
                selectable={true}
                style={[
                  styles.narration,
                  this.props.theme ? styles[`${this.props.theme}Narration`] : null]}>
                {this.props.item.msg}
              </Text>
            </Animated.View>
          : <Animated.View style={[
              styles.container,
              this.props.item.adjacent ? styles.adjacent : null,
              this.props.item.right ? styles.containerRight : null,
              this.props.style ? this.props.style : null,
              this.props.item.abstract ? styles.abstract : null,
              this.props.theme ? styles[`${this.props.theme}Container`] : null,
              this.props.item.abstract ? styles[`${this.props.theme}Abstract`] : null]}>
              {this.props.item.adjacent
                ? null
                : this.props.item.from
                  ? <Text
                      selectable={true}
                      style={[
                        styles.from,
                        this.props.item.right ? styles.right : null,
                        this.props.theme ? styles[`${this.props.theme}${this.props.item.right ? 'Right' : ''}From`] : null,
                        ]}>
                        {this.props.item.from}
                    </Text>
                  : null}
              <Text
                selectable={true}
                style={[
                  styles.body,
                  this.props.theme ? styles[`${this.props.theme}Body`] : null,
                  this.props.item.right ? styles.bodyRight : null]}>
                  {this.props.item.msg || this.props.item.abstract}
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
    padding: 10,
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginTop: 10,
    marginHorizontal: 7,
  },
  abstract: {
    backgroundColor: 'rgba(255,255,255,.6)',
  },
  darkAbstract: {
    backgroundColor: 'rgba(50,50,50,.8)',
  },
  abstractText: {
    fontSize: 11,
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
