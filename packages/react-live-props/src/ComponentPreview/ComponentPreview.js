import React, { Component } from 'react'
import PropTypes from 'prop-types'

import cs from 'classnames'

import styles from './styles.css'

export default class ComponentPreview extends Component {
  static propTypes = {
    component: PropTypes.func.isRequired,
    values: PropTypes.object.isRequired,
    className: PropTypes.string
  }

  render() {
    const {
      component,
      values,
      className,
      ...rest
    } = this.props

    return (
      <div
        className={cs(className)}
        {...rest}
      >
        {React.createElement(component, values)}
      </div>
    )
  }
}
