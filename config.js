const
  {em}          = require('./src/responsive'),
  color         = require('color'),
  dark          = color('#221E1F'),
  white         = '#fff',
  grey          = '#EBEBEB',
  accent        = '#f0888a',
  muted         = '#774345'

// theme colors
module.exports = {
  title: 'Don\'t Be a Pig',
  demoUser: {email: 'demo@wineamp.com', password: 'demo'},

  // users
  usersStartLoggedIn: false,

  // colors & style
  accent:        accent,
  white:         white,
  dark,
  grey,
  muted,

  styles: {
    fontBold: {
      backgroundColor: 'transparent'
    },
    fontMedium: {
      fontWeight: '600',
      backgroundColor: 'transparent',
      letterSpacing: 1},
    h1: {
      color: dark,
      fontSize: em(1.35),
      backgroundColor: 'transparent',
    },
    h2: {
      color: dark,
      fontWeight: 'bold',
      fontSize: em(.85),
      letterSpacing: .2,
      backgroundColor: 'transparent',
      marginBottom: 8
    },
    h3: {
      color: dark,
      fontWeight: '200',
      fontSize: em(1),
      backgroundColor: 'transparent',
    },
    bold: {
      color: dark,
      fontWeight: '200',
      fontSize: em(1.65),
      backgroundColor: 'transparent',
    },
    p: {
      marginTop: 30,
      marginHorizontal: 35,
      backgroundColor: 'transparent',
      lineHeight: em(1.6),
      letterSpacing: .1,
      fontSize: em(1.1),
      textAlign: 'left',
      color: color(dark).fade(.4),
    },
    shadow: {
      shadowColor: '#000000',
      shadowOffset: {
        width: 0,
        height: 5
      },
      shadowRadius: 40,
      shadowOpacity: 1,
      position: 'absolute',
      bottom: 20,
      height: 20,
      left: 0,
      right: 0,
    },
  },

  // location
  address: '12400 Ida Clayton Rd, Calistoga, CA 94515',
  phone: '800-354-4459',

  graphqlUri: 'http://wineapp.manufactur.co/cms/wp-graphql',
}
