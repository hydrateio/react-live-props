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

const PropWrapper = ({ children, description, name, onAdd, onDelete }) => (
  <TextContext.Consumer>
    {(text) => (
      <div className={cs('rlpProp', styles.rlpProp)}>
        {name !== '' && (
          <div className={cs('rlpPropHeader', styles.rlpPropHeader)}>
            <strong className={cs('rlpPropName', styles.rlpPropName)}>
              {buildName(name, text)}
              {typeof onAdd === 'function' && (
                <AddButton onClick={onAdd} className={cs('rlpPropAddButton', styles.rlpPropAddButton)} />
              )}
              {typeof onDelete === 'function' && (
                <DeleteButton onClick={onDelete} className={cs('rlpPropDeleteButton', styles.rlpPropDeleteButton)} />
              )}
            </strong>
            {description && (
              <legend className={cs('rlpPropDescription', styles.rlpPropDescription)}>{description}</legend>
            )}
          </div>
        )}
        <div className={cs('rlpPropInput', styles.rlpPropInput)}>
          {children}
        </div>
      </div>
    )}
  </TextContext.Consumer>
)

PropWrapper.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.func, PropTypes.node]),
  description: PropTypes.string,
  name: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onAdd: PropTypes.func,
  onDelete: PropTypes.func
}

export default PropWrapper
