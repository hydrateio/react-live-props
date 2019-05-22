import React from 'react'
import PropTypes from 'prop-types'
import cs from 'classnames'
import { PropWrapper } from '../../Components'

import styles from './base.css'

const NumberFieldRenderer = ({ name, displayName, value, property, onChange, onDelete }) => {
  const valueOrDefault = value || ''
  return (
    <PropWrapper name={displayName} description={property.description} onDelete={onDelete}>
      <input
        type='number'
        value={valueOrDefault}
        className={cs('rlpPropField', styles.rlpPropField)}
        onChange={
          (e) => {
            if (e.target.value.indexOf('.') > -1) {
              onChange(name, parseFloat(e.target.value, 10))
            } else {
              onChange(name, parseInt(e.target.value, 10))
            }
          }
        }
      />
    </PropWrapper>
  )
}

NumberFieldRenderer.propTypes = {
  name: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.number.isRequired]),
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  property: PropTypes.object.isRequired,
  displayName: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.number.isRequired])
}

export default NumberFieldRenderer
