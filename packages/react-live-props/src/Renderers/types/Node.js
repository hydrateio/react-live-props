import React from 'react'
import PropTypes from 'prop-types'
import cs from 'classnames'
import { SchemaContext } from '../../Context'
import { getDisplayName } from '../../Utils'
import { PropWrapper } from '../../Components'

import styles from './base.css'

class NodeFieldRenderer extends React.Component {
  static propTypes = {
    name: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.number.isRequired]),
    value: PropTypes.any,
    onChange: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    htmlTypes: PropTypes.arrayOf(PropTypes.string),
    property: PropTypes.object.isRequired,
    availableTypes: PropTypes.array,
    displayName: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.number.isRequired])
  }

  constructor(props, context) {
    super(props, context)

    const htmlDictionary = {}
    props.htmlTypes.forEach(type => {
      const typeName = getDisplayName(type)
      htmlDictionary[typeName] = type
    })

    const typeDictionary = {}
    props.availableTypes.filter(type => typeof htmlDictionary[type] === 'undefined').forEach(type => {
      const typeName = getDisplayName(type)
      if (typeName !== 'React.Fragment') {
        typeDictionary[typeName] = type
      }
    })

    const currentTypeName = getDisplayName(props.value || '')
    let currentElementType = null
    if (props.htmlTypes.includes(currentTypeName)) {
      currentElementType = 'HTML'
    } else if (currentTypeName === 'React.Fragment') {
      currentElementType = 'React'
    } else if (typeDictionary[currentTypeName]) {
      currentElementType = 'Component'
    } else {
      currentElementType = 'String'
    }

    this.state = {
      htmlDictionary,
      typeDictionary,
      currentElementType
    }
  }

  render() {
    const { name, displayName, value, onChange, onDelete, property } = this.props

    const currentTypeName = getDisplayName(value || '')
    return (
      <PropWrapper name={displayName} description={property.description} onDelete={onDelete}>
        <select
          className={cs('rlpPropField', styles.rlpPropField)}
          value={this.state.currentElementType}
          onChange={
            (e) => {
              this.setState({
                currentElementType: e.target.value
              })
            }
          }
        >
          <option value='HTML'>HTML Element</option>
          <option value='Component'>Application Component</option>
          <option value='React'>Native React Element</option>
          <option valye='String'>String</option>
        </select>
        {this.state.currentElementType === 'HTML' && (
          <select
            value={currentTypeName}
            className={cs('rlpPropField', styles.rlpPropField)}
            onChange={
              (e) => {
                const newTypeName = e.target.value === '' ? null : e.target.value
                if (newTypeName === null) {
                  onChange(name, null)
                  return
                }

                onChange(name, React.createElement(this.state.htmlDictionary[newTypeName]))
              }
            }
          >
            <option value=''>UNSET</option>
            {Object.keys(this.state.htmlDictionary).map((typeName) => {
              return (
                <option key={typeName} value={typeName}>{typeName}</option>
              )
            })}
          </select>
        )}
        {this.state.currentElementType === 'Component' && (
          <select
            value={currentTypeName}
            className={cs('rlpPropField', styles.rlpPropField)}
            onChange={
              (e) => {
                const newTypeName = e.target.value === '' ? null : e.target.value
                if (newTypeName === null) {
                  onChange(name, null)
                  return
                }

                onChange(name, React.createElement(this.state.typeDictionary[newTypeName]))
              }
            }
          >
            <option value=''>UNSET</option>
            {Object.keys(this.state.typeDictionary).map((typeName) => {
              return (
                <option key={typeName} value={typeName}>{typeName}</option>
              )
            })}
          </select>
        )}
        {this.state.currentElementType === 'React' && (
          <select
            value={currentTypeName}
            className={cs('rlpPropField', styles.rlpPropField)}
            onChange={
              (e) => {
                const newTypeName = e.target.value === '' ? null : e.target.value
                if (newTypeName === 'React.Fragment') {
                  onChange(name, React.createElement(React.Fragment))
                  return
                }

                if (newTypeName === null) {
                  onChange(name, null)
                }
              }
            }
          >
            <option value=''>UNSET</option>
            <option value='React.Fragment'>React.Fragment</option>
          </select>
        )}
        {this.state.currentElementType === 'String' && (
          <textarea
            type='text'
            onChange={
              (e) => {
                onChange(name, e.target.value)
              }
            }
            placeholder='String contents'
            value={typeof value !== 'string' ? '' : value}
            className={cs('rlpPropField', styles.rlpPropField)}
          />
        )}
      </PropWrapper>
    )
  }
}

const NodeFieldRendererWithContext = (props) => (
  <SchemaContext.Consumer>
    {({ availableTypes, htmlTypes }) => (
      <NodeFieldRenderer {...props} availableTypes={availableTypes} htmlTypes={htmlTypes} />
    )}
  </SchemaContext.Consumer>
)

export default NodeFieldRendererWithContext
