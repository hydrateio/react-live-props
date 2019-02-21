import React, { Component } from 'react'
import PropTypes from 'prop-types'

import cs from 'classnames'
import dotProp from 'dot-prop'
import cloneDeep from 'lodash.clonedeep'
import { PropertyRenderer } from '../Renderers'
import { SchemaContext } from '../Context'
import { AddButton } from '../Components'

import './styles.css'

export default class EditablePropsTable extends Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    className: PropTypes.string,
    editableProperties: PropTypes.arrayOf(PropTypes.string),
    blacklistedProperties: PropTypes.arrayOf(PropTypes.string),
    availableTypes: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.func])),
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

  state = {}

  render() {
    const {
      onChange,
      className,
      editableProperties,
      blacklistedProperties,
      availableTypes,
      ...rest
    } = this.props



    return (
      <SchemaContext.Consumer>
        {({ schema, values, editingComponent, htmlTypes }) => {
          const filteredSchema = this.filterProperties(schema[editingComponent])
          const propertyKeys = Object.keys(filteredSchema.properties)
          const currentValue = values[editingComponent]
          const onAdd = (type, name) => this._onAdd(type, name, values, editingComponent)
          const onChange = (name, newValue) => this._onChange(name, newValue, values, editingComponent)
          const onDelete = (name) => this._onDelete(name, values, editingComponent)
          return (
            <div
              className={cs('rlp-editable-props', className)}
              {...rest}
            >
              {propertyKeys.map((key, idx) => {
                const propertyValue = currentValue ? currentValue[key] : null
                return (
                  <PropertyRenderer
                    key={`${key}.${idx}`}
                    parentName={null}
                    name={key}
                    value={propertyValue}
                    onChange={onChange}
                    onDelete={onDelete}
                    onAdd={onAdd}
                    property={filteredSchema.properties[key]}
                    availableTypes={availableTypes}
                  />
                )
              })}

              {htmlTypes.includes(editingComponent) && (
                <div className='rlp-prop'>
                  <div className='rlp-prop-header'>
                    <div className='rlp-prop-name'>
                      <input type='text' value={this.state.pendingAttributeName} onChange={(e) => this.setState({ pendingAttributeName: e.target.value })} />
                    </div>
                    <div className='rlp-prop-input'>
                      <input type='text' value={this.state.pendingAttributeValue} onChange={(e) => this.setState({ pendingAttributeValue: e.target.value })} />
                    </div>
                    <div className='rlp-prop-header-action'>
                      <AddButton onClick={() => this._onAddProperty(editingComponent, schema, values, this.state.pendingAttributeName, this.state.pendingAttributeValue)} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        }}
      </SchemaContext.Consumer>
    )
  }

  _onAddProperty = (editingComponent, schema, values, name, value) => {
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

    const newValues = {
      ...values,
      [editingComponent]: {
        ...values[editingComponent],
        [name]: value
      }
    }

    this.setState({
      pendingAttributeName: '',
      pendingAttributeValue: ''
    }, () => {
      this.props.onAddProperty(newValues, newSchema)
    })
  }

  _onChange = (name, newValue, values, editingComponent) => {
    // dotProp mutates the value, so we need to clone before using dotProp
    const clonedValues = cloneDeep(values)

    dotProp.set(clonedValues, `${editingComponent}.${name}`, newValue)

    this.props.onChange(clonedValues)
  }

  _onDelete = (name, values, editingComponent) => {
    // dotProp mutates the value, so we need to clone before using dotProp
    const clonedValues = cloneDeep(values)

    const nameParts = name.split('.')
    const lastProp = nameParts.pop()
    try {
      const index = parseInt(lastProp, 10)
      // the property is an array index
      const array = dotProp.get(clonedValues, `${editingComponent}.${nameParts.join('.')}`)
      array.splice(index, 1)
      dotProp.set(clonedValues, `${editingComponent}.${nameParts.join('.')}`, array)
    } catch (e) {
      // the property is not an array index
      dotProp.delete(clonedValues, `${editingComponent}.${name}`)
    }

    this.props.onChange(clonedValues)
  }

  _onAdd = (name, type, values, editingComponent) => {
    // dotProp mutates the value, so we need to clone before using dotProp
    const clonedValues = cloneDeep(values)

    const prop = dotProp.get(clonedValues, `${editingComponent}.${name}`)

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
