import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class AdvancedComponent extends Component {
  static propTypes = {
    onSomething: PropTypes.func,

    /**
     * Description foo.
     */
    foo: PropTypes.number.isRequired,

    /**
     * Description bar.
     *
     * - markdown list-item 1
     * - markdown list-item 2
     */
    bar: PropTypes.string,

    /**
     * Description baz.
     */
    baz: PropTypes.bool,

    /**
     * Description boo.
     */
    boo: PropTypes.arrayOf(PropTypes.string),

    far: PropTypes.arrayOf(PropTypes.number),

    faz: PropTypes.arrayOf(PropTypes.shape({
      /**
       * Description prop3
       */
      prop3: PropTypes.string,
      /**
       * Description prop4
       */
      prop4: PropTypes.bool
    })),

    car: PropTypes.oneOf(['Test', 'Value']),

    caz: PropTypes.shape({
      /**
       * Description prop1
       */
      prop1: PropTypes.string,
      /**
       * Description prop2
       */
      prop2: PropTypes.number
    }),

    nestedArrays: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),

    anything: PropTypes.any
  }

  static defaultProps = {
    bar: 'bar'
  }

  render() {
    const {
      foo,
      bar,
      baz,
      boo,
      far,
      faz,
      car,
      caz,
      anything
    } = this.props

    return (
      <div>
        <div>
          foo: {JSON.stringify(foo, null, 2)}
        </div>

        <div>
          bar: {JSON.stringify(bar, null, 2)}
        </div>

        <div>
          baz: {JSON.stringify(baz, null, 2)}
        </div>

        <div>
          boo: {JSON.stringify(boo, null, 2)}
        </div>

        <div>
          far: {JSON.stringify(far, null, 2)}
        </div>

        <div>
          faz: {JSON.stringify(faz, null, 2)}
        </div>

        <div>
          car: {JSON.stringify(car, null, 2)}
        </div>

        <div>
          caz: {JSON.stringify(caz, null, 2)}
        </div>

        <div>
          anything: {JSON.stringify(anything, null, 2)}
        </div>
      </div>
    )
  }
}
