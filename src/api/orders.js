import {
  AsyncStorage
} from 'react-native'

const
  key  = 'orders',
  cart = require('./cart'),
  card = require('./card')
var
  corders = null // cache

// auto serialize to/from async storage
module.exports = {
  hasShipping: async _ => { return !!await addresses.getActive() },
  hasCard: async _ => { return !!await card.getActive() },
  getCached: _ => corders,
  getAll: async _ => {
    return await get()
  },
  add: async _ => {
    const
      orders = await get(),
      items  = await cart.getAll(),
      order  = {
        createdAt: new Date(),
        total: await cart.total(),
        items,
      }
    // TODO send to API
    orders.push(order) // mutates
    await save(orders)
    setTimeout(async _ => await cart.clear(), 1250) // defer
    return orders
  },
}

// ---------
async function get() {
  return corders === null
    ? corders = (await storage.get(key)) || []
    : corders
}

async function save(orders) {
  bus.emit('orders', orders)                                  // broadcast
  setTimeout(async _ => await storage.set(key, orders), 1250) // defer writes
  return orders
}
