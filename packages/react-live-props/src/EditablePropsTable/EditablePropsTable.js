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
    className: PropTypes.string
  }

  render() {
    const {
      schema,
      values,
      onChange,
      className,
      ...rest
    } = this.props

    return (
      <div
        className={cs(styles.container, className)}
        {...rest}
      >
        <Form
          schema={schema}
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
