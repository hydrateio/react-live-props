import React, { Component } from 'react'
import PropTypes from 'prop-types'

import cs from 'classnames'
import dotProp from 'dot-prop'
import cloneDeep from 'lodash.clonedeep'
import { PropertyRenderer } from '../Renderers'

import './styles.css'

export default class EditablePropsTable extends Component {
  static propTypes = {
    schema: PropTypes.object.isRequired,
    values: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    className: PropTypes.string,
    editableProperties: PropTypes.arrayOf(PropTypes.string),
    blacklistedProperties: PropTypes.arrayOf(PropTypes.string)
  }

  static getDerivedStateFromProps(props, state) {
    const blacklistedProperties = props.blacklistedProperties || []

    const editableProperties = props.editableProperties || Object.keys(props.schema.properties)

    const editablePropertyDefs = {}
    editableProperties.forEach(key => {
      if (blacklistedProperties.includes(key)) return

      editablePropertyDefs[key] = props.schema.properties[key]
    })

    if (state.schema && state.schema.properties) {
      const keys = Object.keys(state.schema.properties)
      const editableKeys = Object.keys(editablePropertyDefs)

      if (keys.length === editableKeys.length) return state
    }

    const schema = {
      ...props.schema,
      properties: editablePropertyDefs
    }
    return {
      ...state,
      schema
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
      schema,
      values,
      onChange,
      className,
      editableProperties,
      blacklistedProperties,
      ...rest
    } = this.props

    const propertyKeys = Object.keys(this.state.schema.properties)

    return (
      <div
        className={cs('rlp-editable-props', className)}
        {...rest}
      >
        {propertyKeys.map((key, idx) => {
          const propertyValue = values ? values[key] : null
          return (
            <PropertyRenderer key={`${key}.${idx}`} parentName={null} name={key} value={propertyValue} onChange={this._onChange} onDelete={this._onDelete} onAdd={this._onAdd} property={this.state.schema.properties[key]} />
          )
        })}

      </div>
    )
  }

  _onChange = (name, newValue) => {
    // dotProp mutates the value, so we need to clone before using dotProp
    const clonedValues = cloneDeep(this.props.values)

    dotProp.set(clonedValues, name, newValue)

    this.props.onChange(clonedValues)
  }

  _onDelete = (name) => {
    // dotProp mutates the value, so we need to clone before using dotProp
    const clonedValues = cloneDeep(this.props.values)

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

  _onAdd = (name, type) => {
    // dotProp mutates the value, so we need to clone before using dotProp
    const clonedValues = cloneDeep(this.props.values)

    const array = dotProp.get(clonedValues, name)

    if (type === 'string') {
      array.push('')
    } else if (type === 'number') {
      array.push(0)
    } else if (type === 'boolean') {
      array.push(false)
    } else if (type === 'object') {
      array.push({})
    } else if (type === 'array') {
      array.push([])
    } else {
      array.push(null)
    }

    this.props.onChange(clonedValues)
  }
}
