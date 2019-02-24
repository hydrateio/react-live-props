import React from 'react'
import { MdChevronRight } from 'react-icons/md'

const Expand = ({ onClick }) => (
  <button type='button' onClick={onClick} aria-label='Expand React Live Props'>
    <MdChevronRight />
  </button>
)

export default Expand
