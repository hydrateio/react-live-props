import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class ExampleComponent extends Component {
  static propTypes = {
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
    baz: PropTypes.bool
  }

  static defaultProps = {
    bar: 'bar'
  }

  render() {
    const {
      foo,
      bar,
      baz
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
      </div>
    )
  }
}
