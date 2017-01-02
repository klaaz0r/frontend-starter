import Cycle from '@cycle/xstream-run'
import { makeDOMDriver } from '@cycle/dom'

console.log('hello world!');

const counter = require('./counter').default

Cycle.run(counter, { DOM: makeDOMDriver('.app') })
