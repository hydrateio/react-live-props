import React from 'react'
import { namespaceName } from '../Utils'

const FieldRenderer = ({ parentName, name, type, value, onChange, options }) => {
  const uniqueName = namespaceName(parentName, name)
  if (options) {
    return <select key={uniqueName} name={uniqueName} value={value} onChange={(e) => onChange(uniqueName, e.target.value)}>
      {options.map(option => <option key={option} value={option}>{option}</option>)}
    </select>
  }

  if (type === 'boolean') {
    return <input type='checkbox' key={uniqueName} name={uniqueName} checked={value} onChange={(e) => onChange(uniqueName, e.target.checked)} />
  }

  if (type === 'number') {
    return <input type='number' key={uniqueName} name={uniqueName} value={value} onChange={(e) => onChange(uniqueName, e.target.value)} />
  }

  if (type === 'string') {
    return <input type='text' key={uniqueName} name={uniqueName} value={value} onChange={(e) => onChange(uniqueName, e.target.value)} />
  }

  return <input type='text' key={uniqueName} name={uniqueName} value={value} onChange={(e) => onChange(uniqueName, e.target.value)} />
}

export default FieldRenderer
