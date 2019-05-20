import React from 'react'
import { UIContext } from '../Context'
import PropTypes from 'prop-types'

const AddButton = ({ onClick }) => (
  <UIContext.Consumer>
    {({ AddButton }) => (
      <AddButton onClick={onClick} />
    )}
  </UIContext.Consumer>
)

AddButton.propTypes = {
  onClick: PropTypes.func.isRequired
}

export default AddButton
