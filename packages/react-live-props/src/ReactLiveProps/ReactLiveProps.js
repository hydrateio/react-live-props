import React, { Component } from 'react'
import PropTypes from 'prop-types'

import cs from 'classnames'

import { MdSave, MdAddCircle, MdDelete } from 'react-icons/md'

import PropsTable from '../PropsTable'
import EditablePropsTable from '../EditablePropsTable'
import ComponentPreview from '../ComponentPreview'
import ComponentMarkup from '../ComponentMarkup'
import TreeView from '../TreeView'
import { SchemaContext, UIContext } from '../Context'
import { Expand, Collapse } from '../Components'
import { findComponentProperties, getDisplayName } from '../Utils'

import styles from './styles.css'

const DEFAULT_HTML_TYPES = ['p', 'a', 'em', 'span', 'strong', 'div', 'svg', 'path', 'ul', 'li', 'b', 'ol', 'blockquote', 'cite', 'pre', 'code', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'img', 'caption', 'table', 'tbody', 'thead', 'tr', 'td', 'th', 'tfoot']
const buildComponentTitle = (title, additionalTitleText) => {
  if (!additionalTitleText) return title

  return `${title} - ${additionalTitleText}`
}

const uiElements = {
  SaveButton: ({ onClick, className }) => <button type='button' className={className} onClick={onClick} aria-label='Save Item'>
    <MdSave />
  </button>,
  AddButton: ({ onClick, className }) => <button type='button' className={className} onClick={onClick} aria-label='Add Item'>
    <MdAddCircle />
  </button>,
  DeleteButton: ({ onClick, className }) => <button type='button' className={className} onClick={onClick} aria-label='Delete Item'>
    <MdDelete />
  </button>
}

uiElements.SaveButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string
}

uiElements.AddButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string
}

uiElements.DeleteButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string
}

const initialize = ({
  of,
  docgenInfo,
  additionalTitleText,
  availableTypes,
  initialComponent,
  addButtonComponent = uiElements.AddButton,
  deleteButtonComponent = uiElements.DeleteButton,
  saveButtonComponent = uiElements.SaveButton
}) => {
  const htmlTypes = [...DEFAULT_HTML_TYPES]
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

  const availableChildren = [{ name: 'React.Fragment' }, ...DEFAULT_HTML_TYPES]
  if (availableTypes) {
    availableTypes.forEach(child => {
      if (availableChildren.includes(child)) return

      availableChildren.push(child)
    })

    const typeInfo = DEFAULT_HTML_TYPES.concat(availableTypes).map(type => {
      if (typeof type === 'string') {
        if (!htmlTypes.includes(type)) {
          htmlTypes.push(type)
        }

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

      if (!type.__docgenInfo) {
        console.error('Docgen info missing for type', type)
      }

      return type.__docgenInfo
    })

    const filteredTypes = typeInfo.filter(type => type !== null)
    if (filteredTypes.filter(type => typeof type === 'undefined').length > 0) {
      throw new Error('ReactLiveProps must be given docgenInfo or a component annotated with __docgenInfo')
    }
    allDocGenInfo.push(...filteredTypes)
  } else {
    const typeInfo = DEFAULT_HTML_TYPES.map(type => {
      if (typeof type === 'string') {
        if (!htmlTypes.includes(type)) {
          htmlTypes.push(type)
        }

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

      if (!type.__docgenInfo) {
        console.error('Docgen info missing for type', type)
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
    const docgenInfo = {}
    allDocGenInfo.forEach(typeInfo => {
      try {
        docgenInfo[getDisplayName(typeInfo)] = typeInfo
      } catch (e) {
        console.error('Error parsing schema for type', typeInfo, e)
        throw new Error('Error parsing schema for type ', typeInfo.displayName)
      }
    })

    const safeDisplayName = getDisplayName(info)

    const values = initialComponent || React.createElement(of)

    const configuredUiElements = {
      AddButton: addButtonComponent,
      SaveButton: saveButtonComponent,
      DeleteButton: deleteButtonComponent
    }

    return {
      title: buildComponentTitle(safeDisplayName, additionalTitleText),
      values,
      rootComponentDisplayName: safeDisplayName,
      editingComponent: safeDisplayName,
      editingComponentPath: [],
      htmlTypes,
      availableTypes: availableChildren,
      docgenInfo,
      configuredUiElements
    }
  } catch (err) {
    console.error('ReactLiveProps error initializing', err)
    return {
      errorMessage: err.message
    }
  }
}

export default class ReactLiveProps extends Component {
  static propTypes = {
    of: PropTypes.func.isRequired,
    docgenInfo: PropTypes.object,
    className: PropTypes.string,
    editableProperties: PropTypes.arrayOf(PropTypes.string),
    additionalTitleText: PropTypes.string,
    hideComponentMarkup: PropTypes.bool,
    hideComponentPreview: PropTypes.bool,
    hidePropsTable: PropTypes.bool,
    customComponentMarkup: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    customComponentMarkupHeaderText: PropTypes.string,
    initialComponent: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]),
    availableTypes: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.func])),
    initialCollapsed: PropTypes.bool,
    hideHeader: PropTypes.bool,
    componentPreviewHeaderText: PropTypes.string,
    propsEditorHeaderText: PropTypes.string,
    saveButtonComponent: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    addButtonComponent: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    deleteButtonComponent: PropTypes.oneOfType([PropTypes.string, PropTypes.func])
  }

  constructor(props) {
    super(props)

    this.state = {
      title: null,
      values: null,
      collapsed: this.props.initialCollapsed || false,
      errorMessage: null
    }
  }

  componentDidMount() {
    this.setState(initialize(this.props))
  }

  onToggleExpandCollapse = (collapsed) => {
    this.setState({
      collapsed
    })
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

  _onAddProperty = (editingComponent, attributeName) => {
    const newDocgenInfo = {
      ...this.state.docgenInfo
    }
    newDocgenInfo[editingComponent].props = {
      ...newDocgenInfo[editingComponent].props,
      [attributeName]: {
        description: 'Custom HTML Attribute',
        required: false,
        type: {
          name: 'any'
        }
      }
    }
    this.setState({
      docgenInfo: newDocgenInfo
    })
  }

  _reset = () => {
    this.setState(initialize(this.props))
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
      initialComponent,
      availableTypes,
      initialCollapsed,
      customComponentMarkupHeaderText = 'Custom Component Markup',
      hidePropsTable,
      hideHeader,
      componentPreviewHeaderText = 'Component Preview',
      propsEditorHeaderText = 'Props Editor',
      addButtonComponent,
      deleteButtonComponent,
      saveButtonComponent,
      ...rest
    } = this.props

    const {
      title,
      values,
      rootComponentDisplayName,
      editingComponent,
      htmlTypes,
      editingComponentPath,
      availableTypes: availableChildTypes,
      docgenInfo: allDocGenInfo,
      configuredUiElements
    } = this.state

    if (this.state.errorMessage) {
      return <p className={cs('rlpErrorMessage', styles.rlpErrorMessage)}>
        {this.state.errorMessage}
      </p>
    }

    if (!values) {
      return null
    }

    return (
      <UIContext.Provider value={configuredUiElements}>
        <SchemaContext.Provider value={{ values, rootComponentDisplayName, editingComponent, editingComponentPath, htmlTypes, availableTypes: availableChildTypes, docgenInfo: allDocGenInfo }}>
          <div
            className={cs('rlpContainer', styles.rlpContainer, className)}
            {...rest}
          >
            {!hideHeader && (
              <h2
                className={cs('rlpContainerTitle', styles.rlpContainerTitle)}
                role='button'
                aria-label='Expand/Collapse the ReactLiveProps playground'
                aria-expanded={!this.state.collapsed}
                onClick={() => this.onToggleExpandCollapse(!this.state.collapsed)}
              >
                {title}
                {this.state.collapsed && (
                  <Expand onClick={() => this.onToggleExpandCollapse(!this.state.collapsed)} />
                )}
                {!this.state.collapsed && (
                  <Collapse onClick={() => this.onToggleExpandCollapse(!this.state.collapsed)} />
                )}
              </h2>
            )}

            {!this.state.collapsed && (
              <React.Fragment>
                {!hidePropsTable && (
                  <div className={cs('rlpSection', 'rlpPropsTableMain', styles.rlpSection, styles.rlpPropsTableMain)}>
                    <h6 className={cs('rlpContainerSubTitle', styles.rlpContainerSubTitle)}>Component Props Table</h6>
                    <PropsTable />
                  </div>
                )}

                {!hideComponentPreview && (
                  <div className={cs('rlpSection', 'rlpComponentPreview', styles.rlpSection, styles.rlpComponentPreview)}>
                    <h6 className={cs('rlpContainerSubTitle', styles.rlpContainerSubTitle)}>{componentPreviewHeaderText}</h6>
                    <ComponentPreview />
                  </div>
                )}

                <div className={cs('rlpSection', 'rlpEditablePropsTable', styles.rlpSection, styles.rlpEditablePropsTable)}>
                  <h6 className={cs('rlpContainerSubTitle', styles.rlpContainerSubTitle)}>
                    {propsEditorHeaderText}
                    <button type='button' onClick={this._reset}>Reset</button>
                  </h6>
                  <div className={cs('rlpFlexContainer', styles.rlpFlexContainer)}>
                    {findComponentProperties(allDocGenInfo[rootComponentDisplayName].props).length > 0 && (
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
                        onReset={this._reset}
                      />
                    </div>
                  </div>
                </div>

                {!hideComponentMarkup && (
                  <div className={cs('rlpSection', 'rlpComponentMarkup', styles.rlpSection, styles.rlpComponentMarkup)}>
                    <h6 className={cs('rlpContainerSubTitle', styles.rlpContainerSubTitle)}>Component Markup</h6>
                    <ComponentMarkup />
                  </div>
                )}

                {CustomComponentMarkup && (
                  <div className={cs('rlpSection', 'rlpComponentMarkup', 'rlpCustomComponentMarkup', styles.rlpSection, styles.rlpComponentMarkup, styles.rlpCustomComponentMarkup)}>
                    <h6 className={cs('rlpContainerSubTitle', styles.rlpContainerSubTitle)}>{customComponentMarkupHeaderText}</h6>
                    <CustomComponentMarkup>
                      {values}
                    </CustomComponentMarkup>
                  </div>
                )}
              </React.Fragment>
            )}
          </div>
        </SchemaContext.Provider>
      </UIContext.Provider>
    )
  }
}
