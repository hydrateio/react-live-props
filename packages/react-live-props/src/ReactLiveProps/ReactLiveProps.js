import React, { Component } from 'react'
import PropTypes from 'prop-types'

import cs from 'classnames'

import PropsTable from '../PropsTable'
import { PropsTableEditor } from '../EditablePropsTable'
import ComponentPreview from '../ComponentPreview'
import ComponentMarkup from '../ComponentMarkup'
import TreeView from '../TreeView'
import { SchemaContext, UIContext, TextContext } from '../Context'
import { Expand, Collapse } from '../Components'
import { findComponentProperties } from '../Utils'
import text from '../text'
import { initialize } from './initialize'

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
    hidePropsTable: PropTypes.bool,
    customComponentMarkup: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    componentPreviewWrapperComponent: PropTypes.oneOfType([PropTypes.string, PropTypes.func, PropTypes.node]),
    initialComponent: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]),
    availableTypes: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.func])),
    initialCollapsed: PropTypes.bool,
    hidePropInfo: PropTypes.bool,
    saveButtonComponent: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    addButtonComponent: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    deleteButtonComponent: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    resetButtonComponent: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    text: PropTypes.shape(text)
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

    const attributeType = attributeName !== 'children' ? {
      name: 'any'
    } : {
      name: 'arrayOf',
      value: {
        name: 'node'
      }
    }

    newDocgenInfo[editingComponent].props = {
      ...newDocgenInfo[editingComponent].props,
      [attributeName]: {
        description: this.state.text.htmlAttributeDescription,
        required: false,
        type: attributeType
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
      hidePropsTable,
      hidePropInfo,
      addButtonComponent,
      deleteButtonComponent,
      saveButtonComponent,
      resetButtonComponent,
      componentPreviewWrapperComponent,
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

    const ResetButton = configuredUiElements.ResetButton

    return (
      <TextContext.Provider value={this.state.text}>
        <UIContext.Provider value={configuredUiElements}>
          <SchemaContext.Provider value={{ values, rootComponentDisplayName, editingComponent, editingComponentPath, htmlTypes, availableTypes: availableChildTypes, docgenInfo: allDocGenInfo }}>
            <div
              className={cs('rlpContainer', styles.rlpContainer, className)}
              {...rest}
            >
              {!hidePropInfo && (
                <h2
                  className={cs('rlpContainerTitle', styles.rlpContainerTitle)}
                  role='button'
                  aria-label={this.state.text.expandCollapseAriaLabel}
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
                      <h6 className={cs('rlpContainerSubTitle', styles.rlpContainerSubTitle)}>{this.state.text.propTableHeader}</h6>
                      <PropsTable />
                    </div>
                  )}

                  {!hideComponentPreview && (
                    <div className={cs('rlpSection', 'rlpComponentPreview', styles.rlpSection, styles.rlpComponentPreview)}>
                      <h6 className={cs('rlpContainerSubTitle', styles.rlpContainerSubTitle)}>{this.state.text.componentPreviewHeader}</h6>
                      <ComponentPreview />
                    </div>
                  )}

                  <div className={cs('rlpSection', 'rlpEditablePropsTable', styles.rlpSection, styles.rlpEditablePropsTable)}>
                    <h6 className={cs('rlpContainerSubTitle', styles.rlpContainerSubTitle)}>
                      {this.state.text.propsEditorHeader}
                      <ResetButton onClick={this._reset} />
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
                        <PropsTableEditor
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
                      <h6 className={cs('rlpContainerSubTitle', styles.rlpContainerSubTitle)}>{this.state.text.componentMarkupHeader}</h6>
                      <ComponentMarkup />
                    </div>
                  )}

                  {CustomComponentMarkup && (
                    <div className={cs('rlpSection', 'rlpComponentMarkup', 'rlpCustomComponentMarkup', styles.rlpSection, styles.rlpComponentMarkup, styles.rlpCustomComponentMarkup)}>
                      <h6 className={cs('rlpContainerSubTitle', styles.rlpContainerSubTitle)}>{this.state.text.customComponentMarkupHeader}</h6>
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
      </TextContext.Provider>
    )
  }
}
