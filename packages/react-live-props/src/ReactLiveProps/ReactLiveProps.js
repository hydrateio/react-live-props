import React, { Component } from 'react'
import PropTypes from 'prop-types'

import docgenToJsonSchema from 'react-docgen-to-json-schema'
import cs from 'classnames'
import jsf from 'json-schema-faker'

import EditablePropsTable from '../EditablePropsTable'
import ComponentPreview from '../ComponentPreview'

import styles from './styles.css'

export default class ReactLiveProps extends Component {
  static propTypes = {
    of: PropTypes.func.isRequired,
    docgenInfo: PropTypes.object,
    className: PropTypes.string
  }

  state = {
    schema: null,
    values: null
  }

  componentDidMount() {
    this._reset()
  }

  render() {
    const {
      of,
      docgenInfo,
      className,
      ...rest
    } = this.props

    const {
      schema,
      values
    } = this.state

    if (!schema || !values) {
      return null
    }

    return (
      <div
        className={cs(styles.container, className)}
        {...rest}
      >
        <EditablePropsTable
          schema={schema}
          values={values}
          onChange={this._onChange}
        />

        <ComponentPreview
          component={of}
          values={values}
        />
      </div>
    )
  }

  async _reset() {
    const {
      of,
      docgenInfo
    } = this.props

    const info = docgenInfo || of.__docgenInfo
    if (!info) {
      throw new Error('ReactLiveProps must be given docgenInfo or a component annotated with __docgenInfo')
    }

    try {
      const schema = docgenToJsonSchema(info)
      jsf.option({ alwaysFakeOptionals: true })
      const values = await jsf.resolve(schema)

      console.log(values)

      this.setState({
        schema,
        values
      })
    } catch (err) {
      console.error('ReactLiveProps error resolving JSON Schema', err)
      throw err
    }
  }

  _onChange = (values) => {
    this.setState({
      values
    })
  }
}
