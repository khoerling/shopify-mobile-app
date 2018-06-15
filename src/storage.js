
import {
  AsyncStorage
} from 'react-native'


// auto serialize to/from async storage
module.exports = {
  get: async (key) => JSON.parse(await AsyncStorage.getItem(key)),
  set: async (key, value) => {
    bus.emit(key, value) // notify
    return await AsyncStorage.setItem(key, JSON.stringify(value))
  },
  mrem: async (...keys) => {
    keys.forEach(k => bus.emit(k, null)) // notify
    return await AsyncStorage.multiRemove(keys)
  },
  merge: async (key, value) => {
    try {
      const cur  = JSON.parse(await AsyncStorage.getItem(key) || '{}')
      const copy = Object.assign({}, cur, value)
      AsyncStorage.setItem(key, JSON.stringify(copy))
      bus.emit(key, JSON.stringify(value)) // notify
      return copy
    } catch(error) {
      console.warn(`error saving ${key}: ${error}`)
    }
  },
}
