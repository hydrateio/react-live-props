import React, { Component } from 'react'
import PropTypes from 'prop-types'

import docgenToJsonSchema from 'react-docgen-to-json-schema'
import cs from 'classnames'
import jsf from 'json-schema-faker'

import EditablePropsTable from '../EditablePropsTable'
import ComponentPreview from '../ComponentPreview'
import ComponentMarkup from '../ComponentMarkup'
import ShadowRoot from '../ShadowRoot'

import styles from './styles.css'

export default class ReactLiveProps extends Component {
  static propTypes = {
    of: PropTypes.func.isRequired,
    docgenInfo: PropTypes.object,
    className: PropTypes.string,
    editableProperties: PropTypes.arrayOf(PropTypes.string),
    uiSchema: PropTypes.object,
    additionalTitleText: PropTypes.string,
    hideComponentMarkup: PropTypes.bool
  }

  state = {
    schema: null,
    values: null
  }

  componentDidMount() {
    this._reset()
  }

  buildComponentTitle = (title, additionalTitleText) => {
    if (!additionalTitleText) return title

    return `${title} - ${additionalTitleText}`
  }

  render() {
    const {
      of,
      docgenInfo,
      className,
      editableProperties,
      uiSchema,
      additionalTitleText,
      hideComponentMarkup,
      blacklistedProperties,
      ...rest
    } = this.props

    const {
      schema,
      values
    } = this.state

    if (!schema || !values) {
      return null
    }

    const renderSchema = {
      ...schema,
      title: this.buildComponentTitle(schema.title, additionalTitleText)
    }

    return (
      <ShadowRoot>
        <div
          className={cs('rlp-container', className)}
          {...rest}
        >
          <link rel='stylesheet' type='text/css' href='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css' />
          <link rel='stylesheet' type='text/css' href='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css' />

          <style type='text/css'>
            {styles}
          </style>

          <EditablePropsTable
            schema={renderSchema}
            values={values}
            editableProperties={editableProperties}
            blacklistedProperties={blacklistedProperties}
            uiSchema={uiSchema}
            onChange={this._onChange}
          />

          <hr />

          <ComponentPreview
            component={of}
            values={values}
          />

          {!hideComponentMarkup && (
            <React.Fragment>
              <hr />

              <ComponentMarkup
                component={of}
                values={values}
                schema={schema}
              />
            </React.Fragment>
          )}
        </div>
      </ShadowRoot>
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
      // something in jsf.resolve is mutating the original schema
      // for anyOf properties, so give them a copy of the properties
      const values = await jsf.resolve(JSON.parse(JSON.stringify(schema)))

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
