import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { SchemaContext } from '../Context'
import { hasChildren, findSelectedType, getDisplayName, findNodeProperties } from '../Utils'

import cs from 'classnames'

import styles from './styles.css'

const RenderComponent = ({ component, values, availableTypes, docgenInfo, htmlTypes }) => {
  // just in case they gave us default children which are already elements
  if (component['$$typeof']) {
    return component
  }

  const componentDisplayName = getDisplayName(component)

  const { children, ...restValues } = values
  let restValuesWithNodes = {
    ...restValues
  }
  const nodeProperties = findNodeProperties(componentDisplayName, docgenInfo[componentDisplayName], htmlTypes).filter(name => name !== 'children')
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
    const propComponent = findSelectedType(availableTypes, propComponentType)
    restValuesWithNodes = {
      ...restValuesWithNodes,
      [name]: RenderComponent({ component: propComponent, values: { ...propValues, key: `${componentDisplayName}.${name}.${propComponentType}` }, availableTypes, docgenInfo, htmlTypes })
    }
  })

  if (hasChildren(values)) {
    if (Array.isArray(children)) {
      const childComponents = children.map((child, idx) => {
        const childDisplayName = child.type
        const childValues = children[idx][childDisplayName]
        if (childDisplayName === '@@TEXT') {
          return childValues.text
        }

        const childComponent = findSelectedType(availableTypes, childDisplayName)
        return RenderComponent({ component: childComponent, values: { ...childValues, key: `${childDisplayName}-${idx}` }, availableTypes, docgenInfo, htmlTypes })
      })

      return React.createElement(component, restValuesWithNodes, childComponents)
    }

    const childDisplayName = children.type
    const childValues = children[childDisplayName]

    if (childDisplayName === '@@TEXT') {
      return React.createElement(component, restValuesWithNodes, childValues.text)
    }

    const childComponent = findSelectedType(availableTypes, childDisplayName)
    return React.createElement(component, restValuesWithNodes, RenderComponent({ component: childComponent, values: { ...childValues, key: childDisplayName }, availableTypes, docgenInfo, htmlTypes }))
  }

  const renderedComponent = React.createElement(component, restValuesWithNodes)
  return renderedComponent
}

RenderComponent.propTypes = {
  component: PropTypes.func.isRequired,
  values: PropTypes.object.isRequired,
  availableTypes: PropTypes.array,
  htmlTypes: PropTypes.array,
  docgenInfo: PropTypes.object.isRequired
}

export default class ComponentPreview extends Component {
  static propTypes = {
    component: PropTypes.func.isRequired,
    className: PropTypes.string
  }

  state = {
    hasError: false
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.hasError) {
      return { hasError: false }
    }

    return prevState
  }

  componentDidCatch(error, info) {
    console.error(JSON.stringify(error), info)
    this.setState({
      hasError: true
    })
  }

  render() {
    const {
      component,
      className,
      ...rest
    } = this.props

    if (this.state.hasError) {
      return (
        <p>There was an error rendering the component.  Check your props and try again.</p>
      )
    }

    return (
      <SchemaContext.Consumer>
        {({ values, rootComponentDisplayName, availableTypes, docgenInfo, htmlTypes }) => {
          return (
            <div
              className={cs(className)}
              {...rest}
            >
              <RenderComponent component={component} values={values[rootComponentDisplayName]} availableTypes={availableTypes} htmlTypes={htmlTypes} docgenInfo={docgenInfo} />
            </div>
          )
        }}
      </SchemaContext.Consumer>
    )
  }
}
