import React from 'react'
import RendererResolver from './Resolver'
import { PropWrapper } from '../Components'
import PropTypes from 'prop-types'

import styles from './styles.css'

const PropertyRenderer = ({ name, property, value, onChange }) => {
  return (
    <PropWrapper styles={styles} name={name} description={property.description}>
      <RendererResolver name={name} type={property.type} property={property} onChange={onChange} value={value} styles={styles} />
    </PropWrapper>
  )
}

PropertyRenderer.propTypes = {
  name: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.number.isRequired]),
  property: PropTypes.object.isRequired,
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired
}

export default PropertyRenderer
