import React from 'react'
import PropTypes from 'prop-types'
import RendererResolver from '../Resolver'
import { PropWrapper } from '../../Components'

const ShapeFieldRenderer = ({ name, displayName, type, property, value, onChange, onDelete }) => {
  const keys = Object.keys(type)
  const valueOrDefault = value || {}

  return (
    <PropWrapper name={displayName} description={property.description} onDelete={onDelete}>
      {keys.map((item) => (
        <RendererResolver
          key={`${name}-${item}`}
          name={item}
          displayName={item}
          type={type[item]}
          property={type[item]}
          onChange={(_, newPropValue) => {
            const newValue = {
              ...valueOrDefault,
              [item]: newPropValue
            }
            onChange(name, newValue)
          }}
          value={valueOrDefault[item]}
        />
      ))}
    </PropWrapper>
  )
}

ShapeFieldRenderer.propTypes = {
  name: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.number.isRequired]),
  type: PropTypes.object,
  property: PropTypes.object,
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  displayName: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.number.isRequired])
}

ShapeFieldRenderer.getValueWithDefault = (value) => {
  if (value) return value

  return {}
}

export default ShapeFieldRenderer
