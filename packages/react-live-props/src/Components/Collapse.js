import React from 'react'
import { MdExpandLess } from 'react-icons/md'
import PropTypes from 'prop-types'

const Collapse = ({ onClick, className }) => (
  <button type='button' onClick={onClick} className={className} aria-label='Collapse React Live Props'>
    <MdExpandLess />
  </button>
)

Collapse.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string
}

export default Collapse
