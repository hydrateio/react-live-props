import React, { Component } from 'react'
import PropTypes from 'prop-types'

import docgenToJsonSchema from 'react-docgen-to-json-schema'
import cs from 'classnames'
import jsf from 'json-schema-faker'

import EditablePropsTable from '../EditablePropsTable'
import ComponentPreview from '../ComponentPreview'
import ComponentMarkup from '../ComponentMarkup'
import TreeView from '../TreeView'
import { SchemaContext } from '../Context'

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
    customComponentMarkup: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    defaultComponentChildren: PropTypes.node,
    availableTypes: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.func]))
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
      defaultComponentChildren,
      availableTypes,
      ...rest
    } = this.props

    const {
      schema,
      values,
      rootComponentDisplayName,
      editingComponent,
      htmlTypes
    } = this.state

    if (!schema || !values) {
      return null
    }

    return (
      <SchemaContext.Provider value={{ schema, values, rootComponentDisplayName, editingComponent, htmlTypes }}>
        <div
          className={cs('rlp-container', className)}
          {...rest}
        >
          <h2 className='rlp-container-title'>{schema.title}</h2>

          {!hideComponentPreview && (
            <div className='rlp-section rlp-component-preview'>
              <ComponentPreview
                component={of}
              />
            </div>
          )}

          <div className='rlp-section rlp-editable-props-table'>
            {schema[rootComponentDisplayName].properties && schema[rootComponentDisplayName].properties.children && (
              <div className='rlp-editable-props-table-tree-view'>
                <TreeView
                  of={of}
                  availableTypes={availableTypes}
                  onChangeComponent={this._editComponent}
                />
              </div>
            )}
            <div className='rlp-editable-props-table-spacer' />
            <div className='rlp-editable-props-table-main'>
              <EditablePropsTable
                editableProperties={editableProperties}
                blacklistedProperties={blacklistedProperties}
                onChange={this._onChange}
                availableTypes={availableTypes}
                onAddProperty={this._onAddProperty}
              />
            </div>
          </div>

          {!hideComponentMarkup && (
            <div className='rlp-section rlp-component-markup'>
              <ComponentMarkup
                component={of}
                availableTypes={availableTypes}
              />
            </div>
          )}

          {CustomComponentMarkup && (
            <div className='rlp-section rlp-component-markup rlp-custom-component-markup'>
              <CustomComponentMarkup>
                <ComponentPreview
                  component={of}
                />
              </CustomComponentMarkup>
            </div>
          )}
        </div>
      </SchemaContext.Provider>
    )
  }

  async _reset() {
    const {
      of,
      docgenInfo,
      additionalTitleText,
      availableTypes,
      defaultComponentChildren
    } = this.props

    const htmlTypes = []
    const allDocGenInfo = []
    const info = docgenInfo || of.__docgenInfo
    if (!info) {
      throw new Error('ReactLiveProps must be given docgenInfo or a component annotated with __docgenInfo')
    }

    allDocGenInfo.push(info)

    if (availableTypes) {
      const typeInfo = availableTypes.map(type => {
        if (typeof type === 'string') {
          htmlTypes.push(type)
          return {
            description: '',
            methods: [],
            props: {
              children: {
                description: '',
                required: false,
                type: { name: 'node' }
              }
            },
            displayName: type
          }
        }

        return type.__docgenInfo
      })
      const filteredTypes = typeInfo.filter(type => type !== null)
      if (filteredTypes.filter(type => typeof type === 'undefined').length > 0) {
        throw new Error('ReactLiveProps must be given docgenInfo or a component annotated with __docgenInfo')
      }
      allDocGenInfo.push(...filteredTypes)
    }

    try {
      jsf.option({ alwaysFakeOptionals: true, minItems: 1, maxItems: 2 })
      const typeSchema = {}
      const typeValues = {}
      await Promise.all(allDocGenInfo.map(async typeInfo => {
        typeSchema[typeInfo.displayName] = docgenToJsonSchema(typeInfo)

        // something in jsf.resolve is mutating the original schema
        // for anyOf properties, so give them a copy of the properties
        typeValues[typeInfo.displayName] = await jsf.resolve(JSON.parse(JSON.stringify(typeSchema[typeInfo.displayName])))
      }))

      if (typeValues[info.displayName].children && defaultComponentChildren) {
        typeValues[info.displayName].children = defaultComponentChildren
      }

      this.setState({
        schema: {
          ...typeSchema,
          title: this.buildComponentTitle(typeSchema[info.displayName].title, additionalTitleText)
        },
        values: typeValues,
        rootComponentDisplayName: info.displayName,
        editingComponent: info.displayName,
        htmlTypes
      })
    } catch (err) {
      console.error('ReactLiveProps error resolving JSON Schema', err)
      throw err
    }
  }

  _editComponent = (rootComponentDisplayName) => {
    this.setState({
      editingComponent: rootComponentDisplayName
    })
  }

  _onChange = (values) => {
    this.setState({
      values
    })
  }

  _onAddProperty = (values, schema) => {
    this.setState({
      values,
      schema
    })
  }
}
