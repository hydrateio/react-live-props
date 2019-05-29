import React from 'react'
import PropTypes from 'prop-types'
import cs from 'classnames'
import { PropWrapper } from '../../Components'

import styles from './base.css'

const StringFieldRenderer = ({ name, displayName, value, property, onChange, onDelete, hidePropInfo }) => {
  const valueOrDefault = value || ''
  return (
    <PropWrapper name={displayName} description={property.description} onDelete={onDelete} hidePropInfo={hidePropInfo}>
      <input
        type='text'
        value={valueOrDefault}
        className={cs('rlpPropField', styles.rlpPropField)}
        onChange={
          (e) => {
            onChange(name, e.target.value)
          }
        }
      />
    </PropWrapper>
  )
}

StringFieldRenderer.propTypes = {
  name: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.number.isRequired]),
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
  property: PropTypes.object.isRequired,
  displayName: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.number.isRequired]),
  hidePropInfo: PropTypes.bool
}

export default StringFieldRenderer
