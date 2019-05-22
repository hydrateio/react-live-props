import React from 'react'
import PropTypes from 'prop-types'
import cs from 'classnames'
import { PropWrapper } from '../../Components'

import styles from './base.css'

const EnumFieldRenderer = ({ name, displayName, property, value, onChange, onDelete }) => {
  const valueOrDefault = value || ''

  // computed enums don't expand out the computed values
  if (Array.isArray(property.type.value)) {
    return (
      <PropWrapper name={displayName} description={property.description} onDelete>
        <select
          value={valueOrDefault}
          className={cs('rlpPropField', styles.rlpPropField)}
          onChange={
            (e) => {
              const newValue = e.target.value === '' ? undefined : e.target.value
              onChange(name, newValue)
            }
          }
        >
          <option value='' />
          {property.type.value.map((option) => {
            let optionValue = option.value
            if (typeof optionValue === 'string') {
              if (optionValue.indexOf('\'') === 0 || optionValue.indexOf('"') === 0) {
                optionValue = optionValue.split('').filter((_, idx) => idx !== 0 && idx !== optionValue.length - 1).join('')
              }
            }
            return (
              <option key={optionValue} value={optionValue}>{optionValue}</option>
            )
          })}
        </select>
      </PropWrapper>
    )
  }

  return (
    <PropWrapper name={displayName} description={property.description} onDelete>
      <input
        type='text'
        value={valueOrDefault}
        className={cs('rlpPropField', styles.rlpPropField)}
        onChange={
          (e) => {
            const newValue = e.target.value === '' ? undefined : e.target.value
            onChange(name, newValue)
          }
        }
      />
    </PropWrapper>
  )
}

EnumFieldRenderer.propTypes = {
  name: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.number.isRequired]),
  property: PropTypes.object.isRequired,
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  displayName: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.number.isRequired])
}

export default EnumFieldRenderer
