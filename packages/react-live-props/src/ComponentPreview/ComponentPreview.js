import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { SchemaContext } from '../Context'
import { getDisplayName, hasChildren, findSelectedType } from '../Utils'

import cs from 'classnames'

import styles from './styles.css'

const RenderComponent = ({ component, values, componentDisplayName, availableTypes }) => {
  // just in case they gave us default children which are already elements
  if (component['$$typeof']) {
    return component
  }

  const { children, ...restValues } = values
  if (hasChildren(values)) {
    if (Array.isArray(children)) {
      const childComponents = children.map((child, idx) => {
        const childDisplayName = child.type
        const childValues = children[idx][childDisplayName]
        const childComponent = findSelectedType(availableTypes, childDisplayName)
        return RenderComponent({ component: childComponent, componentDisplayName: childDisplayName, values: { ...childValues, key: `${childDisplayName}-${idx}` }, availableTypes })
      })

      return React.createElement(component, restValues, childComponents)
    }

    const childDisplayName = children.type
    const childValues = children[childDisplayName]
    const childComponent = findSelectedType(availableTypes, childDisplayName)
    return RenderComponent({ component: childComponent, componentDisplayName: childDisplayName, values: { ...childValues, key: childDisplayName }, availableTypes })
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
        {({ values, rootComponentDisplayName, availableTypes }) => {
          return (
            <div
              className={cs(className)}
              {...rest}
            >
              <RenderComponent component={component} values={values[rootComponentDisplayName]} componentDisplayName={rootComponentDisplayName} availableTypes={availableTypes} />
            </div>
          )
        }}
      </SchemaContext.Consumer>
    )
  }
}
