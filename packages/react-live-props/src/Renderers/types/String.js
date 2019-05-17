import React from 'react'
import PropTypes from 'prop-types'
import cs from 'classnames'

const StringFieldRenderer = ({ name, value, onChange, styles }) => {
  const valueOrDefault = value || ''
  return (
    <input type='text' value={valueOrDefault} className={cs('rlpPropField', styles.rlpPropField)} onChange={(e) => {
      onChange(name, e.target.value)
    }} />
  )
}

StringFieldRenderer.propTypes = {
  name: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.number.isRequired]),
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  styles: PropTypes.object
}

export default StringFieldRenderer
