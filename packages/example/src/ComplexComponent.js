import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class ComplexComponent extends Component {
  static propTypes = {
    onSomething: PropTypes.func,

    /**
     * Description foo.
     */
    foo: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),

    /**
     * Description bar.
     *
     * - markdown list-item 1
     * - markdown list-item 2
     */
    bar: PropTypes.array,

    /**
     * Description baz.
     */
    baz: PropTypes.element,

    /**
     * Description boo.
     */
    boo: PropTypes.symbol,

    far: PropTypes.instanceOf(ComplexComponent),

    faz: PropTypes.objectOf(PropTypes.string),

    complexNode: PropTypes.oneOfType([PropTypes.string, PropTypes.func, PropTypes.node])
  }

  static defaultProps = {
    bar: 'bar'
  }

  render() {
    return (
      <div>
        {JSON.stringify(this.props, null, 2)}
      </div>
    )
  }
}
