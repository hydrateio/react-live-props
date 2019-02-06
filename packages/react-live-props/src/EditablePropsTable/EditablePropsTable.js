import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Form from 'react-jsonschema-form'
import cs from 'classnames'

import styles from './styles.css'

export default class EditablePropsTable extends Component {
  static propTypes = {
    schema: PropTypes.object.isRequired,
    values: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    className: PropTypes.string,
    editableProperties: PropTypes.arrayOf(PropTypes.string),
    blacklistedProperties: PropTypes.arrayOf(PropTypes.string),
    uiSchema: PropTypes.object
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
      uiSchema,
      editableProperties,
      blacklistedProperties,
      ...rest
    } = this.props

    return (
      <div
        className={cs(className)}
        {...rest}
      >
        <Form
          schema={this.state.schema}
          uiSchema={uiSchema}
          formData={values}
          onChange={this._onChange}
          onSubmit={this._onChange}
        />
      </div>
    )
  }

  _onChange = (e) => {
    this.props.onChange(e.formData)
  }
}
