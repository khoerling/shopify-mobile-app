import {
  AsyncStorage
} from 'react-native'
import moment from 'moment'

const
  key           = 'tiers',
  membershipKey = 'tiers-membership'

// auto serialize to/from async storage
module.exports = {
  getAll: async _ => {
    return await get()
  },
  getActive: getActive,
  getInactive: async _ => {
    return (await get())
      .filter(t => !t.isActive)[0]
  },

  hasMembership: async _ => {
    return await storage.get(membershipKey)
  },

  activate: async _ => {
    const active = await getActive()
    api.upsertMembership({...active, signupDate: moment().format('L')})
    return await storage.set(membershipKey, true)
  },

  deactivate: async _ => {
    api.upsertMembership({cancelDate: moment().format('L')})
    const tiers = (await get())
      .map((item, i) => { // reset active selection to first
        item.isActive = (i === 0)
        return item
      })
    await save(tiers)
    return await storage.set(membershipKey, false)
  },

  selectTier: async (tier) => {
    return await save(
      (await get())
       .map(item => {
         item.isActive = item.title === tier.title // toggle
         return item
       }))
  },
}

async function get() {
  return await storage.get(key) || config.tiers
}

async function save(tiers) {
  setTimeout(async _ => await storage.set(key, tiers), 1250) // defer writes
  return config.tiers = tiers
}

async function getActive() {
  return (await get())
    .filter(t => t.isActive)[0]
}
