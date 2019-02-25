import React from 'react'
import { MdAddCircle } from 'react-icons/md'
import PropTypes from 'prop-types'

const AddButton = ({ onClick }) => (
  <button type='button' onClick={onClick} aria-label='Add Item'>
    <MdAddCircle />
  </button>
)

AddButton.propTypes = {
  onClick: PropTypes.func.isRequired
}

export default AddButton
