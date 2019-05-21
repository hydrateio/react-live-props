import React from 'react'
import PropTypes from 'prop-types'
import { UIContext } from '../Context'

const SaveButton = ({ onClick, className }) => (
  <UIContext.Consumer>
    {({ SaveButton }) => (
      <SaveButton onClick={onClick} className={className} />
    )}
  </UIContext.Consumer>
)

SaveButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string
}

export default SaveButton
