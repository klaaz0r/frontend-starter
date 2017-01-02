import xs from 'xstream'
import { div, button, p } from '@cycle/dom'

export default function main(sources) {
  const action$ = xs.merge(
    sources.DOM.select('.decrement').events('click').map(ev => -1),
    sources.DOM.select('.increment').events('click').map(ev => +1)
  );

  const count$ = action$.fold((x, y) => x + y, 0);

  return {
    DOM: count$.map(count =>
      div([
          p('this is a how fast is gulp is, and it is fast, like really fast'),
          button('.decrement .ui .button', 'Decrement'),
          button('.increment .ui .button', 'Increment'),
          p('Counter: ' + count)
        ])
    )
  };
}
