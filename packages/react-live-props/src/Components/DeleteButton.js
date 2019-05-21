import React from 'react'
import { UIContext } from '../Context'
import PropTypes from 'prop-types'

const DeleteButton = ({ onClick, className }) => (
  <UIContext.Consumer>
    {({ DeleteButton }) => (
      <DeleteButton onClick={onClick} className={className} />
    )}
  </UIContext.Consumer>
)

DeleteButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string
}

export default DeleteButton
