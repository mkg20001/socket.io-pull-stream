/* eslint-env mocha */

'use strict'

const chai = require('chai')
const dirtyChai = require('dirty-chai')
const expect = chai.expect
const clients = require('./util').default()
chai.use(dirtyChai)
const uuid = require('uuid')
const pull = require('pull-stream')

describe('data', () => {
  it('can create a connection between two clients', cb => {
    clients.two((err, res) => {
      if (err) return cb(err)
      const [c1, c2] = res

      const id = uuid()

      const sink = c1.createSink(id)
      const src = c2.createSource(id)

      const d = Buffer.from('hello')

      c1.emit('createProxy', id, c2._id, () => {
        pull(
          pull.values([d, d]),
          sink
        )
        
        pull(
          src,
          pull.collect((err, res) => {
            if (err) return cb(err)
            expect(res[0]).to.equal(d)
            cb()
          })
        )
      })
    })
  })
})
