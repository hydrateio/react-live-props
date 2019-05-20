import React from 'react'
import PropTypes from 'prop-types'
import { UIContext } from '../Context'

const SaveButton = ({ onClick }) => (
  <UIContext.Consumer>
    {({ SaveButton }) => (
      <SaveButton onClick={onClick} />
    )}
  </UIContext.Consumer>
)

SaveButton.propTypes = {
  onClick: PropTypes.func.isRequired
}

export default SaveButton
