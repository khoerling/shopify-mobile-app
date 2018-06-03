import React from 'react'
import {
  Text,
  Clipboard,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  ViewPropTypes,
  Platform,
} from 'react-native'

export default class Message extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <TouchableWithoutFeedback onPress={_ => this.props.onPress()}>
        <View style={[styles.container, this.props.right ? styles.containerRight : null]}>
          <Text style={[styles.from, this.props.right ? styles.right : null]}>{this.props.from}</Text>
          <Text style={[styles.body, this.props.right ? styles.bodyRight : null]}>{this.props.msg}</Text>
        </View>
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
    marginBottom: 10,
    marginHorizontal: 7,
  },
  bodyRight: {
    fontSize: 15,
  },
  body: {
    fontSize: 17,
    lineHeight: 24,
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