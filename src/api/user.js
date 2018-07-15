import { sha256 } from 'react-native-sha256'

const
  key = 'user'

module.exports = {
  setUserInfo,
  getUserInfo,
  isLoggedIn,
  login,
  logout,
}

// ---------
async function setUserInfo({signup, email, birthday, password, id}) {
  const hashed = await sha256(email + password)
  api.upsertUser({firstName: signup.firstName, lastName: signup.lastName, email, birthday, password, id})
  await storage.set('info', {email, name: `${signup.firstName} ${signup.lastName}`, toggleAndOpen: ''})
  await storage.set(key, {signup, email, birthday, password: hashed, id})
}

async function isLoggedIn() {
  const info = await storage.get('info')
  return typeof(info) === 'string'
}

async function login({id, email, password, name, isFacebook}) {
  if (icmp(config.demoUser.email, email) && icmp(config.demoUser.password, password)) {
    // using demo account
    await storage.set(key,
      {signup: {firstName: config.title, lastName: 'Guest'},
        email: 'demo@wineamp.com',
        password: sha256(config.demoUser.password)})
    return await signInAs({email, name: `${config.title} Guest`})
  } else {
    // local or api login
    const
      user = await getUserInfo(),
      hashed = await sha256(email + password)
    if (isFacebook) {
      // facebook api validated user/password for us
      return await signInAs(
        {email,
         name: name ? name : `${user.signup.firstName} ${user.signup.lastName}`})
    } else if (user && icmp(email, user.email) && hashed === user.password) {
      // local login
      return await signInAs(
        {email,
         name: `${user.signup.firstName} ${user.signup.lastName}`})
    } else {
      // check with external api
      const user = await api.getUser(email, password)
      return user
        ? await signInAs({email, name: `${user.firstName} ${user.lastName}`})
        : false
    }
    return false
  }
}

function icmp(str, str2) {
  if (typeof(str) !== 'string' || typeof(str2) !== 'string') return false // guard
  return str.toLowerCase() === str2.toLowerCase()
}

async function signInAs({email, name}) {
  await storage.set('info', {email, name, toggleAndOpen: ''})
  return true
}

async function logout() {
  storage.set('info', null)
  global.clearActive()
}
async function getUserInfo() {
  return await storage.get(key) || null
}

async function set(user) {
  setTimeout(async _ => await storage.set(key, user), 0) // defer writes
  return user
}
