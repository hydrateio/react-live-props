import React from 'react'
import { MdAddCircle } from 'react-icons/md'

const AddButton = ({ onClick }) => (
  <button type='button' onClick={onClick} aria-label='Add Item'>
    <MdAddCircle />
  </button>
)

export default AddButton
