import React from 'react'
import { namespaceName } from '../Utils'
import { SchemaContext } from '../Context'
import PropTypes from 'prop-types'

const FieldRenderer = ({ parentName, name, type, value, onChange, options }) => {
  const uniqueName = namespaceName(parentName, name)

  if (options) {
    return (
      <SchemaContext>
        {({ values }) => (
          <select key={uniqueName} name={uniqueName} value={value} onChange={(e) => onChange(uniqueName, e.target.value, values)}>
            {options.map(option => <option key={option} value={option}>{option}</option>)}
          </select>
        )}
      </SchemaContext>
    )
  }

  if (type === 'boolean') {
    return (
      <SchemaContext>
        {({ values }) => (
          <input type='checkbox' key={uniqueName} name={uniqueName} checked={value} onChange={(e) => onChange(uniqueName, e.target.checked, values)} />
        )}
      </SchemaContext>
    )
  }

  if (type === 'number') {
    return (
      <SchemaContext>
        {({ values }) => (
          <input type='number' key={uniqueName} name={uniqueName} value={value} onChange={(e) => onChange(uniqueName, e.target.value, values)} />
        )}
      </SchemaContext>
    )
  }

  if (type === 'string') {
    return (
      <SchemaContext>
        {({ values }) => (
          <input type='text' key={uniqueName} name={uniqueName} value={value} onChange={(e) => onChange(uniqueName, e.target.value, values)} />
        )}
      </SchemaContext>
    )
  }

  return (
    <SchemaContext>
      {({ values }) => (
        <input type='text' key={uniqueName} name={uniqueName} value={value} onChange={(e) => onChange(uniqueName, e.target.value, values)} />
      )}
    </SchemaContext>
  )
}

FieldRenderer.propTypes = {
  parentName: PropTypes.string.isRequired,
  name: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  type: PropTypes.string.isRequired,
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array
}

export default FieldRenderer
