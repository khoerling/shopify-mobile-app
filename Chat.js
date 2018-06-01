import React from 'react';
import { Alert } from 'react-native';

var id = 0
export default class Chat extends React.Component {
  state = {
    messages: [],
  }

  randomMessage() {
    id = id + 1
    return {
      _id: id,
      text: 'Lorem ipsum dolor amet blog street art hammock, kombucha listicle plaid vice man braid iPhone. Kombucha heirloom mlkshk meh edison bulb enamel pin. Marfa godard organic crucifix mixtape trust fund wolf fashion axe pok pok sriracha lumbersexual ugh small batch chambray knausgaard. Ethical vaporware fanny pack edison bulb, freegan blog chambray venmo offal shabby chic keffiyeh selfies cardigan snackwave kogi. Hammock hell of blue bottle chillwave neutra asymmetrical vape thundercats next level DIY. Meggings bushwick truffaut vice.',
      createdAt: new Date(),
      user: {
        _id: id,
        name: 'Story',
        avatar: 'https://placeimg.com/140/140/any',
      },
    }
  }

  componentWillMount() {
    this.setState({
      messages: [1, 2, 3, 4, 5].map(this.randomMessage)
    })
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
  }

  render() {
    return (
      <View />
    )
  }
}
