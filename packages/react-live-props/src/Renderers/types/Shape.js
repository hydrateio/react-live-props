import React from 'react'
import PropTypes from 'prop-types'
import RendererResolver from '../Resolver'
import PropWrapper from '../PropWrapper'

const ShapeFieldRenderer = ({ name, type, property, value, onChange, styles }) => {
  const keys = Object.keys(type)
  const valueOrDefault = value || {}

  return (
    <React.Fragment>
      {keys.map((item) => (
        <PropWrapper styles={styles} name={item} description={[item].description} key={`${name}-${item}`}>
          <RendererResolver
            name={item}
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
            styles={styles}
          />
        </PropWrapper>
      ))}
    </React.Fragment>
  )
}

ShapeFieldRenderer.propTypes = {
  name: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.number.isRequired]),
  type: PropTypes.object,
  property: PropTypes.object,
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  styles: PropTypes.object
}

export default ShapeFieldRenderer
