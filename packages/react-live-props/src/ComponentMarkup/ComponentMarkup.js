import React, { Component } from 'react'
import ReactDOMServer from 'react-dom/server'
import PropTypes from 'prop-types'
import { getDisplayName, hasChildren } from '../Utils'
import { SchemaContext } from '../Context'

import cs from 'classnames'

import styles from './styles.css'

/* global Prism */

const renderPropertyValue = (schema, property, value) => {
  let valueOrDefault = typeof value !== 'undefined' ? value : property.default
  if (property.type === 'string') {
    return `"${valueOrDefault}"`
  }

  if (property.type === 'number') {
    return `{${valueOrDefault}}`
  }

  if (property.type === 'boolean') {
    return `{${valueOrDefault}}`
  }

  if (property.type === 'object') {
    return `{${JSON.stringify(valueOrDefault, null, 2)}}`
  }

  if (property.type === 'array') {
    return `{${JSON.stringify(valueOrDefault, null, 2)}}`
  }

  if (property.type === 'null') {
    return `{null}`
  }

  if (property.anyOf) {
    const allowedTypes = property.anyOf.map(type => type.type)

    if (typeof value === 'string' && allowedTypes.includes('string')) {
      return `"${valueOrDefault}"`
    }

    if (typeof value === 'number' && allowedTypes.includes('number')) {
      return `{${valueOrDefault}}`
    }

    if (typeof value === 'boolean' && allowedTypes.includes('boolean')) {
      return `{${valueOrDefault}}`
    }

    return `{${JSON.stringify(valueOrDefault, null, 2)}}`
  }

  return `'${valueOrDefault}'`
}

const buildComponentMarkup = (Component, schema, values, componentDisplayName, availableTypes) => {
  // in case we got a React element
  if (Component['$$typeof']) {
    return ReactDOMServer.renderToStaticMarkup(Component)
  }

  if (componentDisplayName === null) return ''

  const componentName = getDisplayName(Component)
  const componentValues = values[componentDisplayName]
  const componentSchema = schema[componentDisplayName]

  const { properties = {} } = componentSchema
  const { children, ...keys } = properties

  if (hasChildren(componentValues) && properties.children) {
    const displayName = typeof componentValues.children === 'string' ? componentValues.children : componentValues.children && componentValues.children.__docgenInfo ? componentValues.children.__docgenInfo.displayName : null
    const childrenMarkup = buildComponentMarkup(componentValues.children, schema, values, displayName, availableTypes)
    return `<${componentName}
${Object.keys(keys).map(key => {
    const value = renderPropertyValue(componentSchema, properties[key], componentValues[key])
    if (value === '{undefined}') return null

    return `  ${key}=${value}`
  }).filter(item => item !== null).join('\n')}>
  ${childrenMarkup}
</${componentName}>`
  }

  return `<${componentName}
${Object.keys(keys).map(key => {
    const value = renderPropertyValue(componentSchema, properties[key], componentValues[key])
    if (value === '{undefined}') return null

    return `  ${key}=${value}`
  }).filter(item => item !== null).join('\n')} />`
}

export default class ComponentMarkup extends Component {
  static propTypes = {
    component: PropTypes.func.isRequired,
    className: PropTypes.string,
    availableTypes: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.func]))
  }

  componentDidMount() {
    // we don't include prism, but consumers can provide prism.js and prism.css and this will apply
    if (!Prism) return

    this.node.querySelectorAll('code').forEach((block) => {
      Prism.highlightElement(block)
    })
  }

  componentDidUpdate() {
    if (!Prism) return

    this.node.querySelectorAll('code').forEach((block) => {
      Prism.highlightElement(block)
    })
  }

  render() {
    const {
      component,
      className,
      availableTypes,
      ...rest
    } = this.props

    return (
      <SchemaContext.Consumer>
        {({ schema, values, rootComponentDisplayName }) => {
          const componentMarkup = buildComponentMarkup(component, schema, values, rootComponentDisplayName, availableTypes)
          return (
            <div ref={ref => this.node = ref} className={cs('codeRoot', className)} {...rest}>
              <pre>
                <code className='language-jsx'>{componentMarkup}</code>
              </pre>
            </div>
          )
        }}

      </SchemaContext.Consumer>
    )
  }
}
