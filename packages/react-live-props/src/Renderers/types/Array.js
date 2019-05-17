import React from 'react'
import PropTypes from 'prop-types'
import RenderResolver from '../Resolver'
import PropWrapper from '../PropWrapper'
import AddNewItem from '../AddNewItem'

const ArrayFieldRenderer = ({ name, type, property, value, onChange, styles }) => {
  const valueOrDefault = value || []

  return (
    <React.Fragment>
      {valueOrDefault.map((item, idx) => (
        <PropWrapper styles={styles} name={idx} key={`${name}-${idx}`}>
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

ArrayFieldRenderer.propTypes = {
  name: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.number.isRequired]),
  property: PropTypes.object,
  value: PropTypes.array,
  onChange: PropTypes.func.isRequired,
  styles: PropTypes.object,
  type: PropTypes.shape({
    name: PropTypes.string
  })
}

export default ArrayFieldRenderer
