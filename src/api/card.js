import { CardIOView, CardIOModule, CardIOUtilities } from 'react-native-awesome-card-io'
import { processColor } from 'react-native'

const
  key = 'cards'

module.exports = {
  scan: async _ => {
    // awesome-card-io method
    CardIOUtilities.preload()
    return await scanCard()
  },
  addManual: async (form) => {
    // form is the react-native-credit-card-input form
    const
      [expiryMonth, expiryYear] = form.values.expiry.split('/'),
    // save form translated to card.io format
    card = {
      cardType: form.values.type,
      cardNumber: form.values.number,
      expiryMonth,
      expiryYear,
      cvv: form.values.cvc,
      postalCode: form.values.postalCode,
      cardholderName: form.values.name,
    }
    add(card) // don't wait
    return card
  },
  setActive: async (card) => {
    const activated =
      (await getCards())
        .map(c => {c.isActive = c.cardNumber === card.cardNumber; return c})
    save(activated) // don't wait
    return activated
  },
  getAll: async _ => {
    return await getCards()
  },
  getActive: async _ => {
    return (await getCards())
      .filter(c => c.isActive === true)[0] || null
  },
  getInactive: async _ => {
    return (await getCards())
      .filter(c => c.isActive !== true)
  },
  deactivateAll,
  add,
}

// ---------
async function scanCard() {
  try {
    const card = await CardIOModule
      .scanCard({
        suppressManualEntry: true,
        guideColor: processColor(config.accent),
        hideCardIOLogo: true,
        requireCardholderName: true,
      })
    return await add(card) // store
  } catch (e) {
    console.log(e)
    return null
  }
}

async function add(card) {
  const cards = await deactivateAll()
  card.isActive = true
  cards.push(card)
  return await save(cards)
}

async function getCards() {
  return (await storage.get(key)) || []
}

async function deactivateAll() {
  const deactivated =
    (await getCards())
      .map(c => {c.isActive = false; return c})
  save(deactivated) // don't wait
  return deactivated
}

async function save(cards) {
  await storage.set(key, cards)
  return cards
}
