import React, { Component } from 'react'
import PropTypes from 'prop-types'

import docgenToJsonSchema from 'react-docgen-to-json-schema'
import cs from 'classnames'

import EditablePropsTable from '../EditablePropsTable'
import ComponentPreview from '../ComponentPreview'
import ComponentMarkup from '../ComponentMarkup'
import TreeView from '../TreeView'
import { SchemaContext } from '../Context'
import { Expand, Collapse } from '../Components'
import { buildDefaultValuesForType, processReactElementToValue, findNodeProperties, getDisplayName } from '../Utils'

import styles from './styles.css'

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
    initialComponentChildren: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]),
    intialPropValues: PropTypes.object,
    availableTypes: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.func])),
    initialCollapsed: PropTypes.bool,
    generateFakePropValues: PropTypes.bool
  }

  constructor(props) {
    super(props)

    this.state = {
      schema: null,
      values: null,
      collapsed: this.props.initialCollapsed || false
    }
  }

  componentDidMount() {
    this._reset()
  }

  buildComponentTitle = (title, additionalTitleText) => {
    if (!additionalTitleText) return title

    return `${title} - ${additionalTitleText}`
  }

  onToggleExpandCollapse = (collapsed) => {
    this.setState({
      collapsed
    })
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
      initialComponentChildren,
      availableTypes,
      initialCollapsed,
      initialPropValues,
      generateFakePropValues,
      ...rest
    } = this.props

    const {
      schema,
      values,
      rootComponentDisplayName,
      editingComponent,
      htmlTypes,
      editingComponentPath,
      availableTypes: availableChildTypes,
      docgenInfo: allDocGenInfo
    } = this.state

    if (!schema || !values) {
      return null
    }

    return (
      <SchemaContext.Provider value={{ schema, values, rootComponentDisplayName, editingComponent, editingComponentPath, htmlTypes, availableTypes: availableChildTypes, docgenInfo: allDocGenInfo }}>
        <div
          className={cs('rlpContainer', styles.rlpContainer, className)}
          {...rest}
        >
          <h2 className={cs('rlpContainerTitle', styles.rlpContainerTitle)}>
            {schema.title}
            {this.state.collapsed && (
              <Expand onClick={() => this.onToggleExpandCollapse(false)} />
            )}
            {!this.state.collapsed && (
              <Collapse onClick={() => this.onToggleExpandCollapse(true)} />
            )}
          </h2>

          {!this.state.collapsed && (
            <React.Fragment>
              {!hideComponentPreview && (
                <React.Fragment>
                  <h3>Preview</h3>
                  <div className={cs('rlpSection', 'rlpComponentPreview', styles.rlpSection, styles.rlpComponentPreview)}>
                    <ComponentPreview
                      component={of}
                    />
                  </div>
                </React.Fragment>
              )}

              <h3>Component Props</h3>
              <div className={cs('rlpSection', 'rlpEditablePropsTable', styles.rlpSection, styles.rlpEditablePropsTable)}>
                {findNodeProperties(of, allDocGenInfo[rootComponentDisplayName], htmlTypes).length > 0 && (
                  <React.Fragment>
                    <div className={cs('rlpEditablePropsTableTreeView', styles.rlpEditablePropsTableTreeView)}>
                      <TreeView
                        of={of}
                        onChangeComponent={this._editComponent}
                      />
                    </div>
                    <div className={cs('rlpEditablePropsTableSpacer', styles.rlpEditablePropsTableSpacer)} />
                  </React.Fragment>
                )}

                <div className={cs('rlpEditablePropsTableMain', styles.rlpEditablePropsTableMain)}>
                  <EditablePropsTable
                    editableProperties={editableProperties}
                    blacklistedProperties={blacklistedProperties}
                    onChange={this._onChange}
                    onAddProperty={this._onAddProperty}
                  />
                </div>
              </div>

              {!hideComponentMarkup && (
                <React.Fragment>
                  <h3>Markup</h3>
                  <div className={cs('rlpSection', 'rlpComponentMarkup', styles.rlpSection, styles.rlpComponentMarkup)}>
                    <ComponentMarkup
                      component={of}
                    />
                  </div>
                </React.Fragment>
              )}

              {CustomComponentMarkup && (
                <React.Fragment>
                  <h3>Custom Markup</h3>
                  <div className={cs('rlpSection', 'rlpComponentMarkup', 'rlpCustomComponentMarkup', styles.rlpSection, styles.rlpComponentMarkup, styles.rlpCustomComponentMarkup)}>
                    <CustomComponentMarkup>
                      <ComponentPreview
                        component={of}
                      />
                    </CustomComponentMarkup>
                  </div>
                </React.Fragment>
              )}
            </React.Fragment>
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
      initialComponentChildren,
      initialPropValues,
      generateFakePropValues = true
    } = this.props

    const htmlTypes = []
    const allDocGenInfo = []
    const info = docgenInfo || of.__docgenInfo
    if (!info) {
      throw new Error('ReactLiveProps must be given docgenInfo or a component annotated with __docgenInfo')
    }

    allDocGenInfo.push(info)

    allDocGenInfo.push(
      {
        description: 'React Fragment',
        methods: [],
        props: {
          children: {
            description: '',
            required: false,
            type: {
              name: 'arrayOf',
              value: { name: 'node' }
            }
          }
        },
        displayName: getDisplayName('React.Fragment')
      }
    )

    const availableChildren = [{ name: '@@TEXT' }, { name: 'React.Fragment' }]
    if (availableTypes) {
      availableTypes.forEach(child => {
        availableChildren.push(child)
      })

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
                type: {
                  name: 'arrayOf',
                  value: { name: 'node' }
                }
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
      const typeSchema = {}
      const docgenInfo = {}
      allDocGenInfo.forEach(typeInfo => {
        docgenInfo[getDisplayName(typeInfo)] = typeInfo
        typeSchema[getDisplayName(typeInfo)] = docgenToJsonSchema(typeInfo)
      })

      typeSchema['@@TEXT'] = {
        title: 'Text Node',
        properties: {
          text: {
            type: 'string'
          }
        },
        type: 'object'
      }

      const safeDisplayName = getDisplayName(info)

      const initialValues = await buildDefaultValuesForType(typeSchema, safeDisplayName, generateFakePropValues)
      const values = {
        type: safeDisplayName,
        [safeDisplayName]: initialValues
      }

      if (values[safeDisplayName].children && initialComponentChildren) {
        if (typeSchema[safeDisplayName].properties.children.type === 'array') {
          values[safeDisplayName].children = []
          if (Array.isArray(initialComponentChildren)) {
            initialComponentChildren.forEach(child => {
              const childValues = processReactElementToValue(typeSchema, child, docgenInfo, htmlTypes)
              values[safeDisplayName].children.push(childValues)
            })
          } else {
            const childValues = processReactElementToValue(typeSchema, initialComponentChildren, docgenInfo, htmlTypes)
            values[safeDisplayName].children.push(childValues)
          }
        } else {
          const childValues = processReactElementToValue(typeSchema, initialComponentChildren, docgenInfo, htmlTypes)
          values[safeDisplayName].children = childValues
        }
      }

      if (initialPropValues) {
        Object.keys(initialPropValues).forEach(key => {
          if (initialPropValues[key] && initialPropValues[key]['$$typeof']) {
            values[safeDisplayName][key] = processReactElementToValue(typeSchema, initialPropValues[key], docgenInfo, htmlTypes)
          } else if (typeof initialPropValues[key] === 'string' && docgenInfo[safeDisplayName].props[key].type.name === 'node') {
            values[safeDisplayName][key] = {
              type: '@@TEXT',
              '@@TEXT': {
                text: initialPropValues[key]
              }
            }
          } else {
            values[safeDisplayName][key] = initialPropValues[key]
          }
        })
      }

      this.setState({
        schema: {
          ...typeSchema,
          title: this.buildComponentTitle(typeSchema[safeDisplayName].title, additionalTitleText)
        },
        values,
        rootComponentDisplayName: safeDisplayName,
        editingComponent: safeDisplayName,
        editingComponentPath: safeDisplayName,
        htmlTypes,
        availableTypes: availableChildren,
        docgenInfo
      })
    } catch (err) {
      console.error('ReactLiveProps error resolving JSON Schema', err)
      throw err
    }
  }

  _editComponent = (rootComponentDisplayName, componentPath) => {
    this.setState({
      editingComponent: rootComponentDisplayName,
      editingComponentPath: componentPath
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
