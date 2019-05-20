import React from 'react'
import { UIContext } from '../Context'
import PropTypes from 'prop-types'

const DeleteButton = ({ onClick }) => (
  <UIContext.Consumer>
    {({ DeleteButton }) => (
      <DeleteButton onClick={onClick} />
    )}
  </UIContext.Consumer>
)

DeleteButton.propTypes = {
  onClick: PropTypes.func.isRequired
}

export default DeleteButton
