import React, { Component } from 'react'
import PropTypes from 'prop-types'

import cs from 'classnames'
import dotProp from 'dot-prop'
import cloneDeep from 'lodash.clonedeep'
import { PropertyRenderer, AddHtmlAttributeRenderer } from '../Renderers'
import { SchemaContext } from '../Context'

import styles from './styles.css'

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

  filterProperties(schema) {
    const blacklistedProperties = this.props.blacklistedProperties || []

    const editableProperties = this.props.editableProperties || Object.keys(schema.properties)

    const editablePropertyDefs = {}
    editableProperties.forEach(key => {
      if (blacklistedProperties.includes(key)) return

      editablePropertyDefs[key] = schema.properties[key]
    })

    if (schema && schema.properties) {
      const keys = Object.keys(schema.properties)
      const editableKeys = Object.keys(editablePropertyDefs)

      if (keys.length === editableKeys.length) return schema
    }

    return {
      ...schema,
      properties: editablePropertyDefs
    }
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
      onChange,
      className,
      editableProperties,
      blacklistedProperties,
      onAddProperty,
      ...rest
    } = this.props

    return (
      <SchemaContext.Consumer>
        {({ schema, values, editingComponent, editingComponentPath, htmlTypes }) => {
          const filteredSchema = this.filterProperties(schema[editingComponent])
          const propertyKeys = Object.keys(filteredSchema.properties)
          const currentValue = dotProp.get(values, editingComponentPath)

          return (
            <div
              className={cs('rlpEditableProps', styles.rlpEditableProps, className)}
              {...rest}
            >
              {propertyKeys.map((key, idx) => {
                const propertyValue = currentValue ? currentValue[key] : null
                return (
                  <PropertyRenderer
                    key={`${key}.${idx}`}
                    parentName={editingComponentPath}
                    name={key}
                    value={propertyValue}
                    onChange={this._onChange}
                    onDelete={this._onDelete}
                    onAdd={this._onAdd}
                    property={filteredSchema.properties[key]}
                  />
                )
              })}

              {htmlTypes.includes(editingComponent) && (
                <AddHtmlAttributeRenderer pendingAttributeName={this.state.pendingAttributeName} onChange={this._onChangeProperty} pendingAttributeValue={this.state.pendingAttributeValue} onAddProperty={this._onAddProperty} />
              )}
            </div>
          )
        }}
      </SchemaContext.Consumer>
    )
  }

  _onChangeProperty = (state) => {
    this.setState(state)
  }

  _onAddProperty = (editingComponent, editingComponentPath, schema, values, name, value) => {
    const newSchema = {
      ...schema,
      [editingComponent]: {
        ...schema[editingComponent],
        properties: {
          ...schema[editingComponent].properties,
          [name]: {
            type: 'string'
          }
        }
      }
    }

    // dotProp mutates the value, so we need to clone before using dotProp
    const clonedValues = cloneDeep(values)

    const compPropValues = dotProp.get(clonedValues, editingComponentPath)
    compPropValues[name] = value

    this.setState({
      pendingAttributeName: '',
      pendingAttributeValue: ''
    }, () => {
      this.props.onAddProperty(clonedValues, newSchema)
    })
  }

  _onChange = (name, newValue, values) => {
    // dotProp mutates the value, so we need to clone before using dotProp
    const clonedValues = cloneDeep(values)

    dotProp.set(clonedValues, name, newValue)

    this.props.onChange(clonedValues)
  }

  _onDelete = (name, values) => {
    // dotProp mutates the value, so we need to clone before using dotProp
    const clonedValues = cloneDeep(values)

    const nameParts = name.split('.')
    const lastProp = nameParts.pop()
    try {
      const index = parseInt(lastProp, 10)
      // the property is an array index
      const array = dotProp.get(clonedValues, nameParts.join('.'))
      array.splice(index, 1)
      dotProp.set(clonedValues, nameParts.join('.'), array)
    } catch (e) {
      // the property is not an array index
      dotProp.delete(clonedValues, name)
    }

    this.props.onChange(clonedValues)
  }

  _onAdd = (name, type, values) => {
    // dotProp mutates the value, so we need to clone before using dotProp
    const clonedValues = cloneDeep(values)

    const prop = dotProp.get(clonedValues, name)

    if (type === 'string') {
      prop.push('')
    } else if (type === 'number') {
      prop.push(0)
    } else if (type === 'boolean') {
      prop.push(false)
    } else if (type === 'object') {
      prop.push({})
    } else if (type === 'array') {
      prop.push([])
    } else {
      prop.push(null)
    }

    this.props.onChange(clonedValues)
  }
}
