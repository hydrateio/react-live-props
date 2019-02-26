import React from 'react'
import PropTypes from 'prop-types'
import { SchemaContext } from '../Context'
import cs from 'classnames'
import { buildDefaultValuesForType, getDisplayName, getRawDisplayName } from '../Utils'

import styles from './styles.css'

const onChangeType = async (schema, uniqueName, value, values, onChange, onDelete) => {
  if (value === '') {
    // this is a delete
    onDelete(uniqueName, values)
    return
  }

  const typeValue = await buildDefaultValuesForType(schema, value)
  onChange(uniqueName, { type: value, [value]: typeValue }, values)
}

export const ChildrenArrayRenderer = ({ value, uniqueName, name, onChange, onDelete }) => {
  return <SchemaContext.Consumer>
    {({ schema, availableTypes, values }) => {
      if (availableTypes.length === 0) return null

      return (
        <React.Fragment>
          {value.map((child, idx) => {
            return (
              <div className={cs('rlpProp', styles.rlpProp)} key={`${child.type}-${idx}`}>
                <div className={cs('rlpPropHeader', styles.rlpPropHeader)}>
                  <strong className={cs('rlpPropName', styles.rlpPropName)}>{name}</strong>
                  <div className={cs('rlpPropInput', styles.rlpPropInput)}>
                    <select key={`${uniqueName}.${idx}`} name={`${uniqueName}.${idx}`} value={child.type} onChange={(e) => onChangeType(schema, `${uniqueName}.${idx}`, e.target.value, values, onChange, onDelete)}>
                      <option value=''>none</option>
                      {availableTypes.map(availableType => {
                        if (typeof availableType === 'string') return <option key={getDisplayName(availableType)} value={getDisplayName(availableType)}>{getRawDisplayName(availableType)}</option>

                        return <option key={getDisplayName(availableType)} value={getDisplayName(availableType)}>{getRawDisplayName(availableType)}</option>
                      })}
                    </select>
                  </div>
                </div>
              </div>
            )
          })}

          <div className={cs('rlpProp', styles.rlpProp)}>
            <div className={cs('rlpPropHeader', styles.rlpPropHeader)}>
              <strong className={cs('rlpPropName', styles.rlpPropName)}>{name}</strong>
              <div className={cs('rlpPropInput', styles.rlpPropInput)}>
                <select key={`${uniqueName}.${value.length}`} name={`${uniqueName}.${value.length}`} value='' onChange={(e) => onChangeType(schema, `${uniqueName}.${value.length}`, e.target.value, values, onChange, onDelete)}>
                  <option value=''>none</option>
                  {availableTypes.map(availableType => {
                    if (typeof availableType === 'string') return <option key={getDisplayName(availableType)} value={getDisplayName(availableType)}>{getRawDisplayName(availableType)}</option>

                    return <option key={getDisplayName(availableType)} value={getDisplayName(availableType)}>{getRawDisplayName(availableType)}</option>
                  })}
                </select>
              </div>
            </div>
          </div>
        </React.Fragment>
      )
    }}
  </SchemaContext.Consumer>
}

ChildrenArrayRenderer.propTypes = {
  uniqueName: PropTypes.string.isRequired,
  name: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.number.isRequired]),
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
}

export const ChildrenObjectRenderer = ({ value, uniqueName, name, onChange, onDelete }) => {
  return <SchemaContext.Consumer>
    {({ schema, availableTypes, values }) => {
      if (availableTypes.length === 0) return null

      const valueOrDefault = value ? value.type : ''

      return (
        <div className={cs('rlpProp', styles.rlpProp)}>
          <div className={cs('rlpPropHeader', styles.rlpPropHeader)}>
            <strong className={cs('rlpPropName', styles.rlpPropName)}>{name}</strong>
            <div className={cs('rlpPropInput', styles.rlpPropInput)}>
              <select key={uniqueName} name={uniqueName} value={valueOrDefault} onChange={(e) => onChangeType(schema, uniqueName, e.target.value, values, onChange, onDelete)}>
                <option value=''>none</option>
                {availableTypes.map(availableType => {
                  if (typeof availableType === 'string') return <option key={getDisplayName(availableType)} value={getDisplayName(availableType)}>{getRawDisplayName(availableType)}</option>

                  return <option key={getDisplayName(availableType)} value={getDisplayName(availableType)}>{getRawDisplayName(availableType)}</option>
                })}
              </select>
            </div>
          </div>
        </div>
      )
    }}
  </SchemaContext.Consumer>
}

ChildrenObjectRenderer.propTypes = {
  uniqueName: PropTypes.string.isRequired,
  name: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.number.isRequired]),
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
}
