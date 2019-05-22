import React from 'react'
import PropTypes from 'prop-types'
import cs from 'classnames'
import { tryConvertTypeToString, tryParseStringAsType } from '../../Utils'
import { PropWrapper } from '../../Components'

import styles from './base.css'

const AnyFieldRenderer = ({ name, displayName, property, value, onChange, onDelete }) => {
  const valueOrDefault = value || ''
  return (
    <PropWrapper name={displayName} description={property.description} onDelete={onDelete}>
      <input
        type='text'
        value={tryConvertTypeToString(valueOrDefault)}
        className={cs('rlpPropField', styles.rlpPropField)}
        onChange={
          (e) => {
            onChange(name, tryParseStringAsType(e.target.value))
          }
        }
      />
    </PropWrapper>
  )
}

AnyFieldRenderer.propTypes = {
  name: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.number.isRequired]),
  property: PropTypes.object.isRequired,
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  displayName: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.number.isRequired])
}

export default AnyFieldRenderer
