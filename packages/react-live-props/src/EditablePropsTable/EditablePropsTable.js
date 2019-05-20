import React, { Component } from 'react'
import PropTypes from 'prop-types'

import cs from 'classnames'
import { PropertyRenderer, RendererContext, Renderers } from '../Renderers'
import { AddHtmlAttribute } from '../Components'
import { SchemaContext } from '../Context'

import styles from './styles.css'

const updateComponentTree = (rootComponent, editingComponentPath, propName, newValue) => {
  const editedComponent = editingComponentPath.reduce(
    (prev, current) => {
      return prev[current]
    },
    rootComponent
  )
  const updatedComponent = React.cloneElement(editedComponent, {
    [propName]: newValue
  })

  const componentList = []
  let workingComponent = rootComponent
  let currentPropValue = rootComponent
  let workingPath = []
  editingComponentPath.forEach((pathItem) => {
    currentPropValue = currentPropValue[pathItem]
    workingPath.push(pathItem)

    if (currentPropValue['$$typeof']) {
      componentList.push({
        component: workingComponent,
        path: workingPath
      })

      workingComponent = currentPropValue
      workingPath = []
    }
  })

  let currentUpdatedComponent = updatedComponent
  for (let i = 1; i <= componentList.length; i++) {
    const item = componentList[componentList.length - i]
    // strip off the props path item at the beginning
    const propList = item.path.slice(1)
    if (propList.length === 1) {
      // a propList of length one means it is an object prop with no index
      currentUpdatedComponent = React.cloneElement(item.component, {
        [propList[0]]: currentUpdatedComponent
      })
    } else if (propList.length === 2) {
      // a propList of length one means it is an object prop with no index
      const newArrayValues = [
        ...item.component.props[propList[0]]
      ]
      newArrayValues[propList[1]] = currentUpdatedComponent
      currentUpdatedComponent = React.cloneElement(item.component, {
        [propList[0]]: newArrayValues
      })
    } else {
      console.error('Invalid prop list length when updating components', item)
      throw new Error('Invalid prop list when updating components')
    }
  }

  return currentUpdatedComponent
}

export default class EditablePropsTable extends Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    className: PropTypes.string,
    editableProperties: PropTypes.arrayOf(PropTypes.string),
    blacklistedProperties: PropTypes.arrayOf(PropTypes.string),
    onAddProperty: PropTypes.func
  }

  state = {
    pendingAttributeName: '',
    pendingAttributeValue: ''
  }

  filterProperties(docgenInfo) {
    const blacklistedProperties = this.props.blacklistedProperties || []

    const editableProperties = this.props.editableProperties || Object.keys(docgenInfo.props)

    const editablePropertyDefs = {}
    editableProperties.forEach(key => {
      if (blacklistedProperties.includes(key)) return

      editablePropertyDefs[key] = docgenInfo.props[key]
    })

    if (docgenInfo && docgenInfo.props) {
      const keys = Object.keys(docgenInfo.props)
      const editableKeys = Object.keys(editablePropertyDefs)

      if (keys.length === editableKeys.length) return docgenInfo.props
    }

    return editablePropertyDefs
  }

  shouldComponentUpdate(nextProps, nextState) {
    let shouldUpdate = false

    Object.entries(this.props).forEach(([key, val]) => {
      if (nextProps[key] !== val) {
        shouldUpdate = true
      }
    })
    Object.entries(this.state).forEach(([key, val]) => {
      if (nextState[key] !== val) {
        shouldUpdate = true
      }
    })

    if (Object.entries(this.props).length !== Object.entries(nextProps).length) {
      shouldUpdate = true
    }

    if (Object.entries(this.state).length !== Object.entries(nextState).length) {
      shouldUpdate = true
    }

    return shouldUpdate
  }

  state = {
    pendingAttributeName: '',
    pendingAttributeValue: ''
  }

  render() {
    const {
      onChange: _,
      className,
      editableProperties,
      blacklistedProperties,
      onAddProperty,
      ...rest
    } = this.props

    return (
      <SchemaContext.Consumer>
        {({ values, editingComponent, editingComponentPath, htmlTypes, docgenInfo }) => {
          const filteredSchema = this.filterProperties(docgenInfo[editingComponent])
          const propertyKeys = Object.keys(filteredSchema)
          const currentComponent = editingComponentPath.reduce(
            (prev, current) => {
              return prev[current]
            },
            values
          )

          const onChange = (propName, newValue) => {
            const updatedRootComponent = updateComponentTree(values, editingComponentPath, propName, newValue)

            this.props.onChange(updatedRootComponent)
          }

          return (
            <RendererContext.Provider value={{ ...Renderers }}>
              <div
                className={cs('rlpEditableProps', styles.rlpEditableProps, className)}
                {...rest}
              >
                {propertyKeys.map((key, idx) => {
                  return (
                    <PropertyRenderer
                      key={`${key}.${idx}`}
                      name={key}
                      value={currentComponent.props[key]}
                      onChange={onChange}
                      property={filteredSchema[key]}
                    />
                  )
                })}

                {htmlTypes.includes(editingComponent) && (
                  <AddHtmlAttribute pendingAttributeName={this.state.pendingAttributeName} onChange={this._onChangeProperty} pendingAttributeValue={this.state.pendingAttributeValue} onAddProperty={this._onAddProperty} />
                )}
              </div>
            </RendererContext.Provider>
          )
        }}
      </SchemaContext.Consumer>
    )
  }

  _onAddProperty = (editingComponent, editingComponentPath, values, pendingAttributeName, value) => {
    const updatedRootComponent = updateComponentTree(values, editingComponentPath, pendingAttributeName, value)

    this.props.onAddProperty(editingComponent, pendingAttributeName)
    this.props.onChange(updatedRootComponent)

    this.setState((state) => {
      return {
        ...state,
        pendingAttributeName: '',
        pendingAttributeValue: ''
      }
    })
  }

  _onChangeProperty = (state) => {
    this.setState(state)
  }
}
