import React from 'react'
import PropTypes from 'prop-types'
import cs from 'classnames'

const PropWrapper = ({ children, description, styles, name }) => (
  <div className={cs('rlpProp', styles.rlpProp)}>
    <div className={cs('rlpPropHeader', styles.rlpPropHeader)}>
      <strong className={cs('rlpPropName', styles.rlpPropName)}>{name}</strong>
      <div className={cs('rlpPropInput', styles.rlpPropInput)}>
        {children}
      </div>
    </div>
    {description && (
      <legend className={cs('rlpPropDescription', styles.rlpPropDescription)}>{description}</legend>
    )}
  </div>
)

PropWrapper.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.func, PropTypes.node]),
  description: PropTypes.string,
  styles: PropTypes.object,
  name: PropTypes.string
}

export default PropWrapper
