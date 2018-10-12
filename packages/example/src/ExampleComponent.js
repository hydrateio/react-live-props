import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class ExampleComponent extends Component {
  static propTypes = {
    /**
     * Description foo.
     */
    foo: PropTypes.number,

    /**
     * Description bar.
     *
     * - markdown list-item 1
     * - markdown list-item 2
     */
    bar: PropTypes.string.isRequired,

    /**
     * Description baz.
     */
    baz: PropTypes.bool
  }

  static defaultProps = {
    bar: 'bar'
  }

  render() {
    const {
      foo,
      bar,
      baz,
      uncontrolledBoolean
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
          uncontrolledBoolean: {JSON.stringify(uncontrolledBoolean, null, 2)}
        </div>
      </div>
    )
  }
}
