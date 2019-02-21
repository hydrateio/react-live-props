import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { SchemaContext } from '../Context'
import { getDisplayName, hasChildren } from '../Utils'

import cs from 'classnames'

import styles from './styles.css'

const RenderComponent = ({ component, values, componentDisplayName }) => {
  // just in case they gave us default children which are already elements
  if (component['$$typeof']) {
    return component
  }

  const { children, ...restValues } = values[componentDisplayName]
  if (hasChildren(values[componentDisplayName])) {
    const childDisplayName = getDisplayName(children)
    return React.createElement(component, restValues, RenderComponent({ component: children, componentDisplayName: childDisplayName, values: values, childComponent: children }))
  }

  return React.createElement(component, restValues)
}

export default class ComponentPreview extends Component {
  static propTypes = {
    component: PropTypes.func.isRequired,
    className: PropTypes.string
  }

  render() {
    const {
      component,
      className,
      ...rest
    } = this.props

    return (
      <SchemaContext.Consumer>
        {({ values, rootComponentDisplayName }) => {
          return (
            <div
              className={cs(className)}
              {...rest}
            >
              <RenderComponent component={component} values={values} componentDisplayName={rootComponentDisplayName} />
            </div>
          )
        }}
      </SchemaContext.Consumer>
    )
  }
}
