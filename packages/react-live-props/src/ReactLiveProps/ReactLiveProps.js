import React, { Component } from 'react'
import PropTypes from 'prop-types'

import docgenToJsonSchema from 'react-docgen-to-json-schema'
import cs from 'classnames'
import jsf from 'json-schema-faker'

import EditablePropsTable from '../EditablePropsTable'
import ComponentPreview from '../ComponentPreview'
import ComponentMarkup from '../ComponentMarkup'

import './styles.css'

export default class ReactLiveProps extends Component {
  static propTypes = {
    of: PropTypes.func.isRequired,
    docgenInfo: PropTypes.object,
    className: PropTypes.string,
    editableProperties: PropTypes.arrayOf(PropTypes.string),
    additionalTitleText: PropTypes.string,
    hideComponentMarkup: PropTypes.bool,
    hideComponentPreview: PropTypes.bool,
    customComponentMarkup: PropTypes.oneOfType([PropTypes.string, PropTypes.func])
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
      additionalTitleText,
      hideComponentMarkup,
      blacklistedProperties,
      hideComponentPreview,
      customComponentMarkup: CustomComponentMarkup,
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
        className={cs('rlp-container', className)}
        {...rest}
      >
        <h2 className='rlp-container-title'>{schema.title}</h2>

        {!hideComponentPreview && (
          <div className='rlp-section rlp-component-preview'>
            <ComponentPreview
              component={of}
              values={values}
            />
          </div>
        )}

        <div className='rlp-section rlp-editable-props-table'>
          <EditablePropsTable
            schema={schema}
            values={values}
            editableProperties={editableProperties}
            blacklistedProperties={blacklistedProperties}
            onChange={this._onChange}
          />
        </div>

        {!hideComponentMarkup && (
          <div className='rlp-section rlp-component-markup'>
            <ComponentMarkup
              component={of}
              values={values}
              schema={schema}
            />
          </div>
        )}

        {CustomComponentMarkup && (
          <div className='rlp-section rlp-component-markup rlp-custom-component-markup'>
            <CustomComponentMarkup>
              {React.createElement(of, values)}
            </CustomComponentMarkup>
          </div>
        )}
      </div>
    )
  }

  async _reset() {
    const {
      of,
      docgenInfo,
      additionalTitleText
    } = this.props

    const info = docgenInfo || of.__docgenInfo
    if (!info) {
      throw new Error('ReactLiveProps must be given docgenInfo or a component annotated with __docgenInfo')
    }

    try {
      const schema = docgenToJsonSchema(info)
      jsf.option({ alwaysFakeOptionals: true, minItems: 1, maxItems: 2 })
      // something in jsf.resolve is mutating the original schema
      // for anyOf properties, so give them a copy of the properties
      const values = await jsf.resolve(JSON.parse(JSON.stringify(schema)))

      this.setState({
        schema: {
          ...schema,
          title: this.buildComponentTitle(schema.title, additionalTitleText)
        },
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
