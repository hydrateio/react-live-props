import React from 'react'
import PropTypes from 'prop-types'
import cs from 'classnames'

const BoolFieldRenderer = ({ name, value, onChange, styles }) => {
  const valueOrDefault = value || false

  return (
    <input type='checkbox' checked={valueOrDefault} className={cs('rlpPropField', styles.rlpPropField)} onChange={(e) => {
      onChange(name, e.target.checked)
    }} />
  )
}

BoolFieldRenderer.propTypes = {
  name: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.number.isRequired]),
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  styles: PropTypes.object
}

export default BoolFieldRenderer
