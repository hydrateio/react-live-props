import React, { Component } from 'react'
import PropTypes from 'prop-types'

import cs from 'classnames'

import styles from './styles.css'

const getDisplayName = (Component) => {
  return Component.displayName || Component.name || 'Component'
}

const renderPropertyValue = (schema, property, value) => {
  if (property.type === 'string') {
    return `"${value}"`
  }

  if (property.type === 'number') {
    return `{${value}}`
  }

  if (property.type === 'boolean') {
    return `{${value}}`
  }

  if (property.type === 'object') {
    return `{${JSON.stringify(value, null, 2)}}`
  }

  if (property.type === 'array') {
    return `{${JSON.stringify(value, null, 2)}}`
  }

  if (property.type === 'null') {
    return `{null}`
  }

  if (property.anyOf) {
    const allowedTypes = property.anyOf.map(type => type.type)

    if (typeof value === 'string' && allowedTypes.includes('string')) {
      return `"${value}"`
    }

    if (typeof value === 'number' && allowedTypes.includes('number')) {
      return `{${value}}`
    }

    if (typeof value === 'boolean' && allowedTypes.includes('boolean')) {
      return `{${value}}`
    }

    return `{${JSON.stringify(value, null, 2)}}`
  }

  return `'${value}'`
}

const buildComponentMarkup = (Component, schema, values) => {
  const componentName = getDisplayName(Component)

  const { properties } = schema

  return `<${componentName}
${Object.keys(properties).map(key => {
    return `  ${key}=${renderPropertyValue(schema, properties[key], values[key])}`
  }).join('\n')}
/>`
}

export default class ComponentMarkup extends Component {
  static propTypes = {
    schema: PropTypes.object.isRequired,
    component: PropTypes.func.isRequired,
    values: PropTypes.object.isRequired,
    className: PropTypes.string
  }

  render() {
    const {
      component,
      values,
      className,
      schema,
      ...rest
    } = this.props

    const componentMarkup = buildComponentMarkup(component, schema, values)

    return (
      <pre
        className={cs(className)}
        {...rest}
      >
        {componentMarkup}
      </pre>
    )
  }
}
