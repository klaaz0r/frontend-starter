import xs from 'xstream'
import { div, button, p, h1 } from '@cycle/dom'

export default function main(sources) {
  const action$ = xs.merge(
    sources.DOM.select('.decrement').events('click').map(ev => -1),
    sources.DOM.select('.increment').events('click').map(ev => +1)
  )

  const count$ = action$.fold((x, y) => x + y, 0)

  return {
    DOM: count$.map(count =>
      div([
        h1('Gulp is awesome, making streams in hjgjhg'),
        p('you are fat'),
        button('.decrement .ui .button', 'Decrement'),
        button('.increment .ui .button', 'Increment'),
        p('Counter: ' + count)
      ])
    )
  }
}
