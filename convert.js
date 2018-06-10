#!/usr/bin/env node

const
  readline = require('readline'),
  fs = require('fs'),
  messages = []

var
  done = true,
  firstPerson = '',
  lastPerson = '',
  lastMsg = '',
  key = 1

process.argv.forEach((val, index, array) => {
  // read each file line-by-line
  if (index >= 2) {
    const rl = readline.createInterface({
      input: fs.createReadStream(val)
    })
    rl.on('line', (line) => {
      line = line.replace(/ \(CONT’D\)/, '')
      if (line.match(/^$/)) {
        // @ new line, so-- push msg
        done = true
        key = key + 1
        messages.push({
          key,
          from: lastPerson,
          msg: lastMsg.replace(/’/g, "'"),
          right: lastPerson !== firstPerson,
        })
        lastPerson = ''
      } else if (done && line.match(/^([A-Z0-9_\-]+$)/)) {
        // @ name
        if (firstPerson === '') firstPerson = line // set first
        lastPerson = line
        done = false
      } else {
        // set msg
        if (done && lastPerson === '') {
          // @ narration
          lastPerson = 'narration'
          lastMsg = line
        } else {
          // @ msg
          lastMsg = line
        }
        done = false
      }
      // console.log('Line from file:', line)
    })
    rl.on('close', _ => {console.log(JSON.stringify(messages))})
  }
})
