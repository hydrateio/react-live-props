import React, { Component } from 'react'
import ReactDOMServer from 'react-dom/server'
import PropTypes from 'prop-types'

import cs from 'classnames'

import styles from './styles.css'

/* global Prism */

const getDisplayName = (Component) => {
  return Component.displayName || Component.name || 'Component'
}

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

const buildComponentMarkup = (Component, schema, values) => {
  const componentName = getDisplayName(Component)

  const { properties } = schema

  if (properties.children) {
    const keys = Object.keys(properties).filter(key => key !== 'children')
    const childrenMarkup = ReactDOMServer.renderToStaticMarkup(values['children'])
    return `<${componentName}
${keys.map(key => {
    return `  ${key}=${renderPropertyValue(schema, properties[key], values[key])}`
  }).join('\n')}
>
  ${childrenMarkup}
</${componentName}>`
  }

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
      values,
      className,
      schema,
      ...rest
    } = this.props

    const componentMarkup = buildComponentMarkup(component, schema, values)

    return (
      <div ref={ref => this.node = ref} className={cs('codeRoot', className)} {...rest}>
        <pre>
          <code className='language-jsx'>{componentMarkup}</code>
        </pre>
      </div>
    )
  }
}
