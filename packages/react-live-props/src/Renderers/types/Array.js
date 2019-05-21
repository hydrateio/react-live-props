import React from 'react'
import PropTypes from 'prop-types'
import ArrayOfFieldRenderer from './ArrayOf'

const ArrayFieldRenderer = ({ name, displayName, type = { name: 'any' }, property, value, onChange }) => {
  return (
    <ArrayOfFieldRenderer name={name} displayName={displayName} type={type} property={property} value={value} onChange={onChange} />
  )
}

ArrayFieldRenderer.propTypes = {
  name: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.number.isRequired]),
  property: PropTypes.object,
  value: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  onChange: PropTypes.func.isRequired,
  type: PropTypes.shape({
    name: PropTypes.string
  }),
  displayName: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.number.isRequired])
}

ArrayFieldRenderer.getValueWithDefault = (value) => {
  if (value) return value

  return []
}

export default ArrayFieldRenderer
