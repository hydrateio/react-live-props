import React from 'react'
import { MdExpandMore } from 'react-icons/md'

const Collapse = ({ onClick }) => (
  <button type='button' onClick={onClick} aria-label='Collapse React Live Props'>
    <MdExpandMore />
  </button>
)

export default Collapse
