import React from 'react'
import PropTypes from 'prop-types'
import cs from 'classnames'

const EnumFieldRenderer = ({ name, property, value, onChange, styles }) => {
  const valueOrDefault = value || ''
  return (
    <select value={valueOrDefault} className={cs('rlpPropField', styles.rlpPropField)} onChange={(e) => {
      const newValue = e.target.value === '' ? undefined : e.target.value
      onChange(name, newValue)
    }}>
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
  )
}

EnumFieldRenderer.propTypes = {
  name: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.number.isRequired]),
  property: PropTypes.object.isRequired,
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  styles: PropTypes.object
}

export default EnumFieldRenderer
