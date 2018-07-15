import {
  AsyncStorage
} from 'react-native'

const
  key = 'cart'

// auto serialize to/from async storage
module.exports = {
  getCached: _ => ccart,
  getAll: async _ => { // items
    return await get()
  },
  upsertItem,
  total: async cart => {
    return cart
      ? total(cart)
      : total(await get())
  },
  count: async cart => {
    return cart
      ? count(cart)
      : count(await get())
  },
  getItem: async (title) => {
    const
      cart = await get()
    return cart.filter(i => i.title === title)[0] // use title uniqueness
  },
  clear: async _ => await save([]),
  removeItem: async (item) => {
    const
      cart = await get(),
      updatedCart = cart.filter(i => i.title !== item.title) // use title uniqueness
    return await save(updatedCart)
  }
}


// ---------
var ccart = null // cache
async function get() {
  return ccart === null
    ? ccart = (await storage.get(key)) || []
    : ccart
}

async function save(cart) {
  ccart = cart                                        // update cache
  setTimeout(async _ => await storage.set(key, cart), 0) // defer writes
  return cart
}

async function upsertItem(item) {
  const
    cart   = await get(),
    exists = cart.find(i => { return i.title === item.title ? i : null})
  if (exists) {
    if (item.qty === 0) // remove item guard
      return await save(cart.filter(i => i.title !== item.title))
    // otherwise, upsert
    const
      updated = cart.map(i => {
        if (i.title === item.title) {
          if (item.qty === 'inc') item.qty = i.qty + 1
          if (item.qty === 'dec') item.qty = i.qty - 1
          if (item.qty < 1)     item.qty = 0 // guard
          i = item // set
        }
        return i
      })
    return await save(updated)
  } else {                         // add first
    item.qty = 1
    cart.push(item)                // XXX mutates
    return await save(cart)
  }
}

function count(cart) { // sum of items + qty
  return cart.reduce(
    (acc, i) => acc + i.qty, 0)
}

function total(cart) {
  return cart.reduce(
    (acc, i) => acc + (i.price * (i.qty || 1)), 0)
}
