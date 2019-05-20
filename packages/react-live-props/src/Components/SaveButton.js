import React from 'react'
import { MdSave } from 'react-icons/md'
import PropTypes from 'prop-types'

const SaveButton = ({ onClick }) => (
  <button type='button' onClick={onClick} aria-label='Save Item'>
    <MdSave />
  </button>
)

SaveButton.propTypes = {
  onClick: PropTypes.func.isRequired
}

export default SaveButton
