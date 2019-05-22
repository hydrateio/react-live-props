import React from 'react'
import { UIContext } from '../Context'
import PropTypes from 'prop-types'

const AddButton = ({ onClick, className }) => (
  <UIContext.Consumer>
    {({ AddButton }) => (
      <AddButton onClick={onClick} className={className} />
    )}
  </UIContext.Consumer>
)

AddButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string
}

export default AddButton
