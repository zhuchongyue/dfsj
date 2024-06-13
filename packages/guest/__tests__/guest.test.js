'use strict'

const guest = require('..')
const assert = require('assert').strict

assert.strictEqual(guest(), 'Hello from guest')
console.info('guest tests passed')
