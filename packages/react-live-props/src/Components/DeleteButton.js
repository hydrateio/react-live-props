import React from 'react'
import { MdDelete } from 'react-icons/md'
import PropTypes from 'prop-types'

const DeleteButton = ({ onClick }) => (
  <button type='button' onClick={onClick} aria-label='Delete Item'>
    <MdDelete />
  </button>
)

DeleteButton.propTypes = {
  onClick: PropTypes.func.isRequired
}

export default DeleteButton
