import React from 'react'
import { StyleSheet, Text, View, TouchableWithoutFeedback } from 'react-native'
import PhotoGallery from './PhotoGallery'
import { LinearGradient } from 'expo'

const Item = ({ item, onPhotoOpen }) =>
  <TouchableWithoutFeedback onPress={() => onPhotoOpen(item)}>
    <View>
      <PhotoGallery.Photo
        photo={item}
        style={{
          width: item.width,
          height: item.height
        }}
      />
      <LinearGradient colors={['transparent', 'rgba(0,0,0,.3)', 'rgba(0,0,0,.6)']} style={styles.gradient}>
        <Text style={styles.h1}>{item.title}</Text>
        <Text style={styles.h2}>{item.postedBy.toUpperCase()}</Text>
      </LinearGradient>
    </View>
  </TouchableWithoutFeedback>


const styles = StyleSheet.create({
  h1: {
    fontSize: 25,
    lineHeight: 23,
    letterSpacing: -1,
    color: '#fff',
    fontWeight: 'bold',
    paddingBottom: 5,
    paddingRight: 5,
  },
  h2: {
    fontSize: 15,
    lineHeight: 15,
    color: '#fff',
    opacity: .9,
    fontWeight: 'bold',
    paddingBottom: 5,
    paddingRight: 5,
  },
  gradient: {
    flex: 1,
    alignItems: 'flex-start',
    position: 'absolute',
    backgroundColor: 'transparent',
    paddingTop: 30,
    paddingLeft: 10,
    bottom: 0,
    left: 0,
    right: 0,
  },
})
export default Item
