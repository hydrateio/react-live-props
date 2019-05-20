import React from 'react'
import PropTypes from 'prop-types'
import cs from 'classnames'
import RenderResolver from '../Resolver'
import { AddNewItem, DeleteButton, PropWrapper } from '../../Components'

import arrayStyles from './Array.css'

const ArrayOfFieldRenderer = ({ name, type, property, value, onChange, styles }) => {
  const valueOrDefault = typeof value === 'string' ? [value] : value || []

  return (
    <React.Fragment>
      {valueOrDefault.map((item, idx) => (
        <PropWrapper styles={styles} name={idx} key={`${name}-${idx}`}>
          <div className={cs('rlpArrayItem', arrayStyles.arrayItem)}>
            <DeleteButton
              onClick={() => {
                const updatedValues = value.filter((_, itemIndex) => {
                  if (itemIndex === idx) return false

                  return true
                })
                onChange(name, updatedValues)
              }}
            />
            <div>
              <RenderResolver
                name={name}
                type={type}
                property={property}
                onChange={(name, updatedValue) => {
                  const updatedValues = value.map((origValue, itemIndex) => {
                    if (itemIndex === idx) {
                      return updatedValue
                    }

                    return origValue
                  })
                  onChange(name, updatedValues)
                }}
                value={item}
                styles={styles}
              />
            </div>
          </div>
        </PropWrapper>
      ))}
      <PropWrapper styles={styles} name={valueOrDefault.length}>
        <AddNewItem
          onChange={(_, updatedValue) => onChange(name, [...valueOrDefault, updatedValue])}
          defaultValue=''
          name={name}
        >
          {({ onChange: onEdit, currentValue }) => (
            <RenderResolver
              name={name}
              value={currentValue}
              onChange={onEdit}
              type={type}
              property={property}
              styles={styles}
            />
          )}
        </AddNewItem>
      </PropWrapper>
    </React.Fragment>
  )
}

ArrayOfFieldRenderer.propTypes = {
  name: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.number.isRequired]),
  property: PropTypes.object,
  value: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  onChange: PropTypes.func.isRequired,
  styles: PropTypes.object,
  type: PropTypes.shape({
    name: PropTypes.string
  })
}

ArrayOfFieldRenderer.getValueWithDefault = (value) => {
  if (value) return value

  return []
}

export default ArrayOfFieldRenderer
