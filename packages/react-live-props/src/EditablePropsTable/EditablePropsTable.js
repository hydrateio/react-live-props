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
    uiSchema: PropTypes.object
  }

  static getDerivedStateFromProps(props, state) {
    const editableProperties = props.editableProperties || Object.keys(props.schema.properties)

    const editablePropertyDefs = {}
    editableProperties.forEach(key => {
      editablePropertyDefs[key] = props.schema.properties[key]
    })

    const schema = {
      ...props.schema,
      properties: editablePropertyDefs
    }
    return {
      ...state,
      schema
    }
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
      ...rest
    } = this.props

    return (
      <div
        className={cs(styles.container, className)}
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
