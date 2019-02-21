import React from 'react'
import { namespaceName, findSelectedType } from '../Utils'

const FieldRenderer = ({ parentName, name, type, value, onChange, options, availableTypes }) => {
  const uniqueName = namespaceName(parentName, name)

  if (name === 'children') {
    const currentValue = typeof value === 'string' ? value : value ? value.name : ''

    return <select key={uniqueName} name={uniqueName} value={currentValue} onChange={(e) => onChange(uniqueName, findSelectedType(availableTypes, e.target.value))}>
      <option value=''>default (normally empty unless ReactLiveProps was given default children)</option>
      {availableTypes.map(availableType => {
        if (typeof availableType === 'string') return <option key={availableType} value={availableType}>{availableType}</option>

        return <option key={availableType} value={availableType.name}>{availableType.name}</option>
      })}
    </select>
  }

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
