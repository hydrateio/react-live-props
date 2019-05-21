import React from 'react'
import cs from 'classnames'
import { SchemaContext, TextContext } from '../Context'
import { Expand, Collapse } from '../Components'

import styles from './styles.css'

const TYPES_WITH_DETAILS = ['enum', 'arrayOf', 'shape']

class PropsTable extends React.Component {
  state = {
    selectedComponentDisplayName: null,
    expandedProperties: {}
  }

  updateComponent = (e) => {
    this.setState({
      selectedComponentDisplayName: e.target.value,
      expandedProperties: {}
    })
  }

  expandProperty = (propName) => {
    this.setState({
      expandedProperties: {
        ...this.state.expandedProperties,
        [propName]: true
      }
    })
  }

  collapseProperty = (propName) => {
    const { [propName]: propToRemove, ...rest } = this.state.expandedProperties
    this.setState({
      expandedProperties: {
        ...rest
      }
    })
  }

  getEnumDetails = (values) => {
    return values.map(value => value.value).join(', ')
  }

  getArrayOfDetails = (values) => {
    if (values.name === 'shape') {
      return `ArrayOf<${this.getShapeDetails(values.value)}>`
    }

    if (values.name === 'arrayOf') {
      return `ArrayOf<${this.getArrayOfDetails(values.value)}>`
    }

    return `ArrayOf<'${values.name}'>`
  }

  getShapeDetails = (values) => {
    return `Shape<{ ${Object.keys(values).map(key => `'${key}': '${values[key].name}'`).join(', ')} }>`
  }

  render() {
    return (
      <div className={cs('rlpPropsTable', styles.rlpPropsTable)}>
        <TextContext.Consumer>
          {(text) => (
            <SchemaContext.Consumer>
              {({ rootComponentDisplayName, docgenInfo }) => {
                const currentComponent = this.state.selectedComponentDisplayName || rootComponentDisplayName
                const componentProps = docgenInfo[currentComponent].props
                return (
                  <React.Fragment>
                    {componentProps && Object.keys(componentProps).length > 0 && (
                      <table>
                        <thead>
                          <tr>
                            <th className={cs('rlpPropName', styles.rlpPropName)}>{text.propertyColumnName}</th>
                            <th className={cs('rlpTypeName', styles.rlpTypeName)}>{text.typeColumnName}</th>
                            <th className={cs('rlpDescription', styles.rlpDescription)}>{text.descriptionColumnName}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.keys(componentProps).map(propName => {
                            const property = componentProps[propName]
                            return (
                              <tr key={propName}>
                                <td className={cs('rlpPropName', styles.rlpPropName)}>
                                  {propName}
                                  {property.required && (
                                    <span className={cs('rlpRequired', styles.rlpRequired)}>({text.required})</span>
                                  )}
                                </td>
                                <td className={cs('rlpTypeName', styles.rlpTypeName)}>
                                  <div>
                                    {property.type.name}
                                    {TYPES_WITH_DETAILS.includes(property.type.name) && !this.state.expandedProperties[propName] && (
                                      <Expand className={cs('rlpTypeNameAction', styles.rlpTypeNameAction)} onClick={() => this.expandProperty(propName)} />
                                    )}
                                    {TYPES_WITH_DETAILS.includes(property.type.name) && this.state.expandedProperties[propName] && (
                                      <Collapse className={cs('rlpTypeNameAction', styles.rlpTypeNameAction)} onClick={() => this.collapseProperty(propName)} />
                                    )}
                                  </div>
                                  {this.state.expandedProperties[propName] && (
                                    <div className={cs('rlpPropertyTypeDetails', styles.rlpPropertyTypeDetails)}>
                                      {property.type.name === 'enum' && (
                                        <em>{this.getEnumDetails(property.type.value)}</em>
                                      )}
                                      {property.type.name === 'arrayOf' && (
                                        <em>{this.getArrayOfDetails(property.type.value)}</em>
                                      )}
                                      {property.type.name === 'shape' && (
                                        <em>{this.getShapeDetails(property.type.value)}</em>
                                      )}
                                    </div>
                                  )}
                                </td>
                                <td className={cs('rlpDescription', styles.rlpDescription)}>{property.description}</td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    )}
                    {(!componentProps || Object.keys(componentProps).length === 0) && (
                      <div className={cs('rlpNoAvailableProperties', styles.rlpNoAvailableProperties)}>
                        <em>{text.noPropertiesMessage}</em>
                      </div>
                    )}
                  </React.Fragment>
                )
              }}
            </SchemaContext.Consumer>
          )}
        </TextContext.Consumer>
      </div>
    )
  }
}

export default PropsTable
