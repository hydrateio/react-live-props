import React from 'react'
import PropTypes from 'prop-types'
import cs from 'classnames'
import AddButton from './AddButton'
import DeleteButton from './DeleteButton'

import styles from './PropWrapper.css'
import { TextContext } from '../Context'

const buildName = (name, text) => {
  if (typeof name === 'number') {
    return `${text.arrayItemLabel}${name}`
  }

  return name
}

const PropWrapper = ({ children, description, name, onAdd, onDelete, hidePropInfo }) => (
  <TextContext.Consumer>
    {(text) => (
      <div className={cs('rlpProp', styles.rlpProp, hidePropInfo && styles.rlpPropHiddenPropInfo)}>
        {name !== '' && (
          <div className={cs('rlpPropHeader', styles.rlpPropHeader)}>
            <strong className={cs('rlpPropName', styles.rlpPropName)}>
              {!hidePropInfo && buildName(name, text)}
              {typeof onAdd === 'function' && (
                <AddButton onClick={onAdd} className={cs('rlpPropAddButton', styles.rlpPropAddButton)} />
              )}
              {typeof onDelete === 'function' && !hidePropInfo && (
                <DeleteButton onClick={onDelete} className={cs('rlpPropDeleteButton', styles.rlpPropDeleteButton)} />
              )}
            </strong>
            {description && !hidePropInfo && (
              <legend className={cs('rlpPropDescription', styles.rlpPropDescription)}>{description}</legend>
            )}
          </div>
        )}
        {hidePropInfo && (
          <div className={cs('rlpPropInputWithDelete', styles.rlpPropInputWithDelete)}>
            {typeof onDelete === 'function' && (
              <DeleteButton onClick={onDelete} className={cs('rlpPropDeleteButton', styles.rlpPropDeleteButton)} />
            )}
            <div className={cs('rlpPropInput', styles.rlpPropInput)}>
              {children}
            </div>
          </div>
        )}
        {!hidePropInfo && (
          <div className={cs('rlpPropInput', styles.rlpPropInput)}>
            {children}
          </div>
        )}
      </div>
    )}
  </TextContext.Consumer>
)

PropWrapper.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.func, PropTypes.node]),
  description: PropTypes.string,
  name: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onAdd: PropTypes.func,
  onDelete: PropTypes.func,
  hidePropInfo: PropTypes.bool
}

export default PropWrapper
