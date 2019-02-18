import React from 'react'
import { MdDelete } from 'react-icons/md'

const DeleteButton = ({ onClick }) => (
  <button type='button' onClick={onClick} aria-label='Delete Item'>
    <MdDelete />
  </button>
)

export default DeleteButton
