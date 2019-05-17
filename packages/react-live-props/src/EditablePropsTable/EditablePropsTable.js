import React, { Component } from 'react'
import PropTypes from 'prop-types'

import cs from 'classnames'
import { PropertyRenderer, AddHtmlAttributeRenderer, RendererContext, Renderers } from '../Renderers'
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

  filterProperties(docgenInfo) {
    const blacklistedProperties = this.props.blacklistedProperties || []

    const editableProperties = this.props.editableProperties || Object.keys(docgenInfo.props)

    const editablePropertyDefs = {}
    editableProperties.forEach(key => {
      if (blacklistedProperties.includes(key)) return

      editablePropertyDefs[key] = docgenInfo.props[key]
    })

    if (docgenInfo && docgenInfo.props) {
      const keys = Object.keys(docgenInfo.props)
      const editableKeys = Object.keys(editablePropertyDefs)

      if (keys.length === editableKeys.length) return docgenInfo.props
    }

    return editablePropertyDefs
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
        {({ values, editingComponent, editingComponentPath, htmlTypes, docgenInfo }) => {
          const filteredSchema = this.filterProperties(docgenInfo[editingComponent])
          const propertyKeys = Object.keys(filteredSchema)

          const onChange = (propName, newValue) => {
            this.props.onChange(React.cloneElement(values, {
              [propName]: newValue
            }))
          }

          return (
            <RendererContext.Provider value={{ ...Renderers }}>
              <div
                className={cs('rlpEditableProps', styles.rlpEditableProps, className)}
                {...rest}
              >
                {propertyKeys.map((key, idx) => {
                  return (
                    <PropertyRenderer
                      key={`${key}.${idx}`}
                      name={key}
                      value={values.props[key]}
                      onChange={onChange}
                      property={filteredSchema[key]}
                    />
                  )
                })}

                {htmlTypes.includes(editingComponent) && (
                  <AddHtmlAttributeRenderer pendingAttributeName={this.state.pendingAttributeName} onChange={this._onChangeProperty} pendingAttributeValue={this.state.pendingAttributeValue} onAddProperty={this._onAddProperty} />
                )}
              </div>
            </RendererContext.Provider>
          )
        }}
      </SchemaContext.Consumer>
    )
  }

  _onChangeProperty = (state) => {
    this.setState(state)
  }
}
