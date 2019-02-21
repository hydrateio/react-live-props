import React from 'react'
import PrimitiveArrayRenderer from './PrimitiveArray'
import FieldRenderer from './Field'
import { AddButton, DeleteButton } from '../Components'
import { namespaceName, tryParseStringAsType, tryConvertTypeToString } from '../Utils'

const PropertyRenderer = ({ parentName, name, property, value, onChange, onDelete, onAdd, availableTypes }) => {
  if (name === 'children' && !availableTypes) return null

  const singleFieldTypes = ['number', 'boolean', 'string']

  if (name === 'children') {
    return <div className='rlp-prop'>
      <div className='rlp-prop-header'>
        <strong className='rlp-prop-name'>{name}</strong>
        <div className='rlp-prop-input'>
          <FieldRenderer parentName={parentName} name={name} type={property.type} value={value} onChange={onChange} options={property.enum} onDelete={onDelete} onAdd={onAdd} availableTypes={availableTypes} />
        </div>
      </div>
    </div>
  }

  if (singleFieldTypes.includes(property.type)) {
    const currentValue = typeof value !== 'undefined' && value !== null ? value : property.default
    return <div className='rlp-prop'>
      <div className='rlp-prop-header'>
        <strong className='rlp-prop-name'>{name}</strong>
        <div className='rlp-prop-input'>
          <FieldRenderer parentName={parentName} name={name} type={property.type} value={currentValue} onChange={onChange} options={property.enum} onDelete={onDelete} onAdd={onAdd} availableTypes={availableTypes} />
        </div>
      </div>
      {property.description && (
        <legend className='rlp-prop-description'>{property.description}</legend>
      )}
    </div>
  }

  if (property.type === 'array') {
    if (singleFieldTypes.includes(property.items.type)) {
      return <PrimitiveArrayRenderer parentName={parentName} name={name} property={property} value={value} onChange={onChange} onDelete={onDelete} onAdd={onAdd} availableTypes={availableTypes} />
    }

    if (property.items.type === 'object') {
      return <ObjectArrayRenderer parentName={parentName} name={name} property={property} value={value} onChange={onChange} onDelete={onDelete} onAdd={onAdd} availableTypes={availableTypes} />
    }

    return <div className='rlp-prop'>
      <label>
        {name}
        NOT SUPPORTED
      </label>
    </div>
  }

  if (property.type === 'object') {
    return <ObjectRenderer parentName={parentName} name={name} property={property} value={value} onChange={onChange} onDelete={onDelete} onAdd={onAdd} availableTypes={availableTypes} />
  }

  return <div className='rlp-prop'>
    <div className='rlp-prop-header'>
        <strong className='rlp-prop-name'>{name}</strong>
        <div className='rlp-prop-input'>
        <input type='text' name={name} value={tryConvertTypeToString(value)} onChange={(e) => onChange(namespaceName(parentName, name), tryParseStringAsType(e.target.value))} />
        </div>
      </div>
      {property.description && (
        <legend className='rlp-prop-description'>{property.description}</legend>
      )}
  </div>
}

export const ObjectArrayRenderer = ({ parentName, name, property, value, onChange, onDelete, onAdd, availableTypes }) => {
  const newParentName = namespaceName(parentName, name)

  return <div className='rlp-prop'>
    <div className='rlp-prop-header'>
      <strong className='rlp-prop-name'>{name}</strong>
      <div className='rlp-prop-header-action'>
        <AddButton onClick={() => onAdd(newParentName, 'object')} />
      </div>
    </div>
    {property.description && (
      <legend className='rlp-prop-description'>{property.description}</legend>
    )}
    <div className='rlp-prop-input'>
      {value && value.map((item, idx) => (
        <div className='rlp-prop-list-item' key={namespaceName(newParentName, `value-${idx}`)}>
          <div className='rlp-prop-list-item-input'>
            <ObjectRenderer parentName={newParentName} name={idx} value={item} property={property.items} onChange={onChange} onDelete={onDelete} onAdd={onAdd} availableTypes={availableTypes} />
          </div>
          <DeleteButton onClick={() => onDelete(namespaceName(newParentName, idx))} />
        </div>
      ))}
    </div>
  </div>
}

export const ObjectRenderer = ({ parentName, name, property, value, onChange, onDelete, onAdd, availableTypes }) => {
  let propertyKeys = []
  if (property.properties) {
    propertyKeys = Object.keys(property.properties)
  }

  const newParentName = namespaceName(parentName, name)

  return <div className='rlp-prop'>
    <span>{name}</span>
    {propertyKeys.map((key, idx) => {
      const itemValue = value ? value[key] : null
      const currentValue = typeof itemValue !== 'undefined' && itemValue !== null ? itemValue : property.properties[key].default
      return (
        <PropertyRenderer key={namespaceName(newParentName, idx)} parentName={newParentName} name={key} property={property.properties[key]} value={currentValue} onChange={onChange} onDelete={onDelete} onAdd={onAdd} availableTypes={availableTypes} />
      )
    })}
  </div>
}

export default PropertyRenderer
