import React from 'react'
import PropTypes from 'prop-types'
import cs from 'classnames'
import { tryConvertTypeToString, tryParseStringAsType } from '../../Utils'

const AnyFieldRenderer = ({ name, value, onChange, styles }) => {
  const valueOrDefault = value || ''
  return (
    <input type='text' value={tryConvertTypeToString(valueOrDefault)} className={cs('rlpPropField', styles.rlpPropField)} onChange={(e) => {
      onChange(name, tryParseStringAsType(e.target.value))
    }} />
  )
}

AnyFieldRenderer.propTypes = {
  name: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.number.isRequired]),
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  styles: PropTypes.object
}

export default AnyFieldRenderer
