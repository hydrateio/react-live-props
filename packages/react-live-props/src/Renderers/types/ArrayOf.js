import React from 'react'
import PropTypes from 'prop-types'
import cs from 'classnames'
import RenderResolver from '../Resolver'
import { PropWrapper } from '../../Components'

import arrayStyles from './Array.css'

const emptyProperty = {
  description: null
}

const ArrayOfFieldRenderer = ({ name, displayName, type, property, value, onChange, onDelete }) => {
  const valueOrDefault = typeof value === 'string' ? [value] : value || []

  return (
    <PropWrapper
      name={displayName}
      description={property.description}
      onAdd={
        () => {
          onChange(name, [...valueOrDefault, null])
        }
      }
      onDelete={onDelete}
    >
      {valueOrDefault.map((item, idx) => (
        <div className={cs('rlpArrayItem', arrayStyles.arrayItem)} key={`${name}-${idx}`}>
          <RenderResolver
            name={name}
            displayName={idx}
            type={type}
            property={emptyProperty}
            onChange={(name, updatedValue) => {
              const updatedValues = value.map((origValue, itemIndex) => {
                if (itemIndex === idx) {
                  return updatedValue
                }

                return origValue
              })
              onChange(name, updatedValues)
            }}
            onDelete={() => {
              const updatedValues = value.filter((_, itemIndex) => {
                if (itemIndex === idx) return false

                return true
              })
              onChange(name, updatedValues)
            }}
            value={item}
          />
        </div>
      ))}
    </PropWrapper>
  )
}

ArrayOfFieldRenderer.propTypes = {
  name: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.number.isRequired]),
  property: PropTypes.object,
  value: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  onChange: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  type: PropTypes.shape({
    name: PropTypes.string
  }),
  displayName: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.number.isRequired])
}

ArrayOfFieldRenderer.getValueWithDefault = (value) => {
  if (value) return value

  return []
}

export default ArrayOfFieldRenderer
