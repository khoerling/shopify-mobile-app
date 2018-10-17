import React, { PureComponent } from 'react'
import { View, Text, TouchableOpacity, ActivityIndicator, Platform, StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/SimpleLineIcons'

const config = require('../../config')

module.exports = class Button extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
    }
  }
  render() {
    const {
      arrowColor,
      arrowStyle,
      icon,
      type,
      title,
      style,
      titleStyle,
      ...rest} = this.props
    return (
        <TouchableOpacity
          onPress={_ => {
            if (this.props.onPress) this.props.onPress()
          }}
          activeOpacity={.9}
          style={[styles.button, styles[type], style]}
          {...rest}>
          <View style={[styles.container]}>
            {icon ? <View style={styles.icon}>{icon}</View> : null}
            <View style={{flex: 1}}>
              {title
                ? <Text style={[styles.title, styles[`${type}Title`], titleStyle]}>{title}</Text>
                : this.props.children}
            </View>
            {(this.props.arrow)
              ? <Icon.Button
                  size={22}
                  style={[styles.arrow, arrowStyle]}
                  name="arrow-right"
                  backgroundColor="transparent"
                  color={arrowColor || config.darkGrey}
                  onPress={_ => {
                    if (this.props.onPress) this.props.onPress()
                  }} />
              : <Text />}
          </View>
        </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 3,
    paddingVertical: 7,
    paddingBottom: 13,
  },
  button: {
  },
  icon: {
    marginLeft: 6,
    marginRight: 15,
  },
  medium: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: config.accent,
    backgroundColor: config.lightContrast,
  },
  title: {
    backgroundColor: 'transparent',
    paddingVertical: 5,
    textAlign: 'center',
    ...config.styles.medium,
    color: config.white,
    fontSize: 15,
  },
  contrast: {...config.styles.contrastButton},
  contrastTitle: {
    fontSize: 13,
  },
  arrow: {
    backgroundColor: 'transparent',
    marginTop: 5,
  },
})
