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
        {this.props.from === 'narration'
          ? <View><Text style={[styles.narration, this.props.theme ? styles[`${this.props.theme}Narration`] : null]}>{this.props.msg}</Text></View>
          : <View style={[styles.container, this.props.right ? styles.containerRight : null, this.props.theme ? styles[`${this.props.theme}Container`] : null]}>
              <Text style={[styles.from, this.props.right ? styles.right : null, this.props.theme ? styles[`${this.props.theme}${this.props.right ? 'Right' : ''}From`] : null, ]}>{this.props.from}</Text>
                <Text style={[styles.body, this.props.theme ? styles[`${this.props.theme}Body`] : null, this.props.right ? styles.bodyRight : null]}>{this.props.msg}</Text>
            </View>
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
    marginBottom: 10,
    marginHorizontal: 7,
  },
  darkNarration: {
    color: '#aaa',
  },
  narration: {
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    marginBottom: 30,
    marginHorizontal: 25,
  },
  bodyRight: {
    fontSize: 17,
  },
  body: {
    fontSize: 19,
    lineHeight: 24,
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
