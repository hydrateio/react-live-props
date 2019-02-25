import React from 'react'
import { MdExpandMore } from 'react-icons/md'
import PropTypes from 'prop-types'

const Collapse = ({ onClick }) => (
  <button type='button' onClick={onClick} aria-label='Collapse React Live Props'>
    <MdExpandMore />
  </button>
)

Collapse.propTypes = {
  onClick: PropTypes.func.isRequired
}

export default Collapse
