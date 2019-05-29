import React from 'react'
import PropTypes from 'prop-types'
import cs from 'classnames'
import { PropWrapper } from '../../Components'

import styles from './base.css'

const BoolFieldRenderer = ({ name, displayName, property, value, onChange, onDelete, hidePropInfo }) => {
  const valueOrDefault = value || false

  return (
    <PropWrapper name={displayName} description={property.description} onDelete={onDelete} hidePropInfo={hidePropInfo}>
      <input
        type='checkbox'
        checked={valueOrDefault}
        className={cs('rlpPropField', styles.rlpPropField)}
        onChange={
          (e) => {
            onChange(name, e.target.checked)
          }
        }
      />
    </PropWrapper>
  )
}

BoolFieldRenderer.propTypes = {
  name: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.number.isRequired]),
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
  property: PropTypes.object.isRequired,
  displayName: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.number.isRequired]),
  hidePropInfo: PropTypes.bool
}

export default BoolFieldRenderer
