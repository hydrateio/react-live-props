import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { hasChildren, findNodeProperties, convertSafeDisplayNameToRaw } from '../Utils'
import { SchemaContext } from '../Context'

import cs from 'classnames'

import styles from './styles.css'

/* global Prism */

const INDENTATION_SIZE = 2

const renderPropertyValue = (property, value) => {
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
    if (valueOrDefault && typeof valueOrDefault === 'string' && valueOrDefault.startsWith('<')) {
      // this is a JSX node
      return `{${valueOrDefault}}`
    }
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

const renderIndentation = (level) => {
  const spaces = []
  for (let i = 0; i < level; i++) {
    for (let j = 0; j < INDENTATION_SIZE; j++) {
      spaces.push(' ')
    }
  }

  return spaces.join('')
}

const StaticMarkupRenderer = ({ componentName, schema, values, indentationLevel, availableTypes, htmlTypes, docgenInfo, skipNewLines = false }) => {
  // in case we got a React element
  if (componentName === null) return ''

  const newLine = skipNewLines ? '' : '\n'

  if (componentName === '@@TEXT') {
    return `${renderIndentation(indentationLevel)}${values.text}`
  }

  const componentSchema = schema[componentName]

  const { properties = {} } = componentSchema
  const { children, ...keys } = properties

  let restValuesWithNodes = {
    ...values
  }
  const nodeProperties = findNodeProperties(componentName, docgenInfo[componentName], htmlTypes).filter(name => name !== 'children')
  nodeProperties.forEach(name => {
    if (!values[name] || !values[name].type) {
      restValuesWithNodes = {
        ...restValuesWithNodes,
        [name]: null
      }

      return
    }
    const propComponentType = values[name].type
    const propValues = values[name][propComponentType]
    restValuesWithNodes = {
      ...restValuesWithNodes,
      [name]: StaticMarkupRenderer({ componentName: propComponentType, schema, values: propValues, indentationLevel: 0, availableTypes, htmlTypes, docgenInfo, skipNewLines })
    }
  })

  if (hasChildren(values) && properties.children) {
    // if there are multiple children then render them as an array
    if (Array.isArray(values.children)) {
      const childrenMarkup = values.children.map((child, idx) => {
        const displayName = child.type
        const childValues = child[displayName]
        return StaticMarkupRenderer({ componentName: displayName, schema, values: childValues, indentationLevel: indentationLevel + 1, availableTypes, htmlTypes, docgenInfo, skipNewLines })
      })

      return `${renderIndentation(indentationLevel)}<${convertSafeDisplayNameToRaw(componentName)}${Object.keys(keys).map(key => {
        const value = renderPropertyValue(properties[key], restValuesWithNodes[key])
        if (value === '{undefined}') return null

        return `${newLine}${renderIndentation(indentationLevel + 1)}${key}=${value}`
      }).filter(item => item !== null).join('')}>
${childrenMarkup.join(newLine)}
${renderIndentation(indentationLevel)}</${convertSafeDisplayNameToRaw(componentName)}>`
    }

    // otherwise render the children as a single object
    const displayName = values.children.type
    const childValues = values.children[displayName]
    const childrenMarkup = StaticMarkupRenderer({ componentName: displayName, schema, values: childValues, indentationLevel: indentationLevel + 1, availableTypes, htmlTypes, docgenInfo, skipNewLines })
    return `${renderIndentation(indentationLevel)}<${convertSafeDisplayNameToRaw(componentName)}${Object.keys(keys).map(key => {
      const value = renderPropertyValue(properties[key], restValuesWithNodes[key])
      if (value === '{undefined}') return null

      return `\n${renderIndentation(indentationLevel + 1)}${key}=${value}`
    }).filter(item => item !== null).join('')}>
${childrenMarkup}
${renderIndentation(indentationLevel)}</${convertSafeDisplayNameToRaw(componentName)}>`
  }

  // if there are no children then just render the component and props
  return `${renderIndentation(indentationLevel)}<${convertSafeDisplayNameToRaw(componentName)}${Object.keys(keys).map(key => {
    const value = renderPropertyValue(properties[key], restValuesWithNodes[key])
    if (value === '{undefined}') return null

    return `${newLine}${renderIndentation(indentationLevel + 1)}${key}=${value}`
  }).filter(item => item !== null).join('')} />`
}

export default class ComponentMarkup extends Component {
  static propTypes = {
    component: PropTypes.func.isRequired,
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
      className,
      ...rest
    } = this.props

    return (
      <SchemaContext.Consumer>
        {({ schema, values, rootComponentDisplayName, availableTypes, htmlTypes, docgenInfo }) => {
          const componentMarkup = StaticMarkupRenderer({ componentName: rootComponentDisplayName, schema, values: values[rootComponentDisplayName], indentationLevel: 0, availableTypes, htmlTypes, docgenInfo })
          return (
            <div ref={ref => this.node = ref} className={cs('codeRoot', styles.codeRoot, className)} {...rest}>
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
