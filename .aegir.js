'use strict'

const SIO = require('socket.io')
const pull = require('./src')
const http = require('http')
let io, serv

const routingTable = {}

function boot(done) {
  serv = http.createServer(() => {})
  io = SIO(serv)
  io.on('connection', client => {
    pull(client, {codec: 'buffer'})

    client.on('createProxy', (id, to, f) => {
      client.createProxy(id, routingTable[to])
      if (f) f()
    })

    client.on('hello', () => client.emit('world', client.id))

    routingTable[client.id] = client
  })

  serv.listen(5982, done)
}

function stop(done) {
  serv.close(done)
}

module.exports = {
  hooks: {
    pre: boot,
    post: stop
  }
}
