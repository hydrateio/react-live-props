import React from 'react'
import { MdExpandMore } from 'react-icons/md'
import PropTypes from 'prop-types'

const Expand = ({ onClick, className }) => (
  <button type='button' onClick={onClick} className={className} aria-label='Expand React Live Props'>
    <MdExpandMore />
  </button>
)

Expand.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string
}

export default Expand
