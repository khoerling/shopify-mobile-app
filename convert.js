#!/usr/bin/env node

const
  readline = require('readline'),
  fs = require('fs'),
  messages = []

var
  done = true,
  firstFrom = '',
  lastFrom = null,
  from = '',
  msg = '',
  key = 1

process.argv.forEach((val, index, array) => {
  // read each file line-by-line
  if (index >= 2) {
    const rl = readline.createInterface({
      input: fs.createReadStream(val)
    })
    rl.on('line', (line) => {
      const
        cont     = / \(CONT’D\)/,
        adjacent = lastFrom === from
      line = line.replace(cont, '')
      if (line.match(/^$/)) {
        // @ new line, so-- push msg
        done = true
        key = key + 1
        messages.push({
          key,
          adjacent,
          from,
          msg: msg.replace(/’/g, "'"),
          right: from !== firstFrom,
        })
        lastFrom = from
        from = ''
      } else if (done && line.match(/^([A-Z0-9_\-]+$)/)) {
        // @ name
        if (firstFrom === '') firstFrom = line // set first
        from = line
        done = false
      } else {
        // set msg
        if (done && from === '') {
          // @ narration
          from = 'narration'
          msg = line
        } else {
          // @ msg
          msg = line
        }
        done = false
      }
      // console.log('Line from file:', line)
    })
    rl.on('close', _ => {console.log(JSON.stringify(messages))})
  }
})
