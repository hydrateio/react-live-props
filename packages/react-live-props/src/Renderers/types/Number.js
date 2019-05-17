import React from 'react'
import PropTypes from 'prop-types'
import cs from 'classnames'

const NumberFieldRenderer = ({ name, value, onChange, styles }) => {
  const valueOrDefault = value || ''
  return (
    <input type='number' value={valueOrDefault} className={cs('rlpPropField', styles.rlpPropField)} onChange={(e) => {
      if (e.target.value.indexOf('.') > -1) {
        onChange(name, parseFloat(e.target.value, 10))
      } else {
        onChange(name, parseInt(e.target.value, 10))
      }
    }} />
  )
}

NumberFieldRenderer.propTypes = {
  name: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.number.isRequired]),
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  styles: PropTypes.object
}

export default NumberFieldRenderer
