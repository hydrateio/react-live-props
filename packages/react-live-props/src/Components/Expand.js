import React from 'react'
import { MdChevronRight } from 'react-icons/md'
import PropTypes from 'prop-types'

const Expand = ({ onClick }) => (
  <button type='button' onClick={onClick} aria-label='Expand React Live Props'>
    <MdChevronRight />
  </button>
)

Expand.propTypes = {
  onClick: PropTypes.func.isRequired
}

export default Expand
