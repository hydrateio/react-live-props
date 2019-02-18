import React from 'react'
import PrimitiveArrayRenderer from './PrimitiveArray'
import FieldRenderer from './Field'
import { AddButton, DeleteButton } from '../Components'
import { namespaceName } from '../Utils'

const PropertyRenderer = ({ parentName, name, property, value, onChange, onDelete, onAdd }) => {
  const singleFieldTypes = ['number', 'boolean', 'string']

  if (singleFieldTypes.includes(property.type)) {
    const currentValue = typeof value !== 'undefined' && value !== null ? value : property.default
    return <div className='rlp-prop'>
      <div className='rlp-prop-header'>
        <strong className='rlp-prop-name'>{name}</strong>
        <div className='rlp-prop-input'>
          <FieldRenderer parentName={parentName} name={name} type={property.type} value={currentValue} onChange={onChange} options={property.enum} onDelete={onDelete} onAdd={onAdd} />
        </div>
      </div>
      {property.description && (
        <legend className='rlp-prop-description'>{property.description}</legend>
      )}
    </div>
  }

  if (property.type === 'array') {
    if (singleFieldTypes.includes(property.items.type)) {
      return <PrimitiveArrayRenderer parentName={parentName} name={name} property={property} value={value} onChange={onChange} onDelete={onDelete} onAdd={onAdd} />
    }

    if (property.items.type === 'object') {
      return <ObjectArrayRenderer parentName={parentName} name={name} property={property} value={value} onChange={onChange} onDelete={onDelete} onAdd={onAdd} />
    }

    return <div className='rlp-prop'>
      <label>
        {name}
        NOT SUPPORTED
      </label>
    </div>
  }

  if (property.type === 'object') {
    return <ObjectRenderer parentName={parentName} name={name} property={property} value={value} onChange={onChange} onDelete={onDelete} onAdd={onAdd} />
  }

  return <div className='rlp-prop'>
    <div className='rlp-prop-header'>
        <strong className='rlp-prop-name'>{name}</strong>
        <div className='rlp-prop-input'>
        <input type='text' name={name} value={value} onChange={(e) => onChange(namespaceName(parentName, name), e.target.value)} />
        </div>
      </div>
      {property.description && (
        <legend className='rlp-prop-description'>{property.description}</legend>
      )}
  </div>
}

export const ObjectArrayRenderer = ({ parentName, name, property, value, onChange, onDelete, onAdd }) => {
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
            <ObjectRenderer parentName={newParentName} name={idx} value={item} property={property.items} onChange={onChange} onDelete={onDelete} onAdd={onAdd} />
          </div>
          <DeleteButton onClick={() => onDelete(namespaceName(newParentName, idx))} />
        </div>
      ))}
    </div>
  </div>
}

export const ObjectRenderer = ({ parentName, name, property, value, onChange, onDelete, onAdd }) => {
  const propertyKeys = Object.keys(property.properties)
  const newParentName = namespaceName(parentName, name)

  return <div className='rlp-prop'>
    <span>{name}</span>
    {propertyKeys.map((key, idx) => {
      const itemValue = value ? value[key] : null
      const currentValue = typeof itemValue !== 'undefined' && itemValue !== null ? itemValue : property.properties[key].default
      return (
        <React.Fragment key={namespaceName(newParentName, idx)}>
          <PropertyRenderer key={key} parentName={newParentName} name={key} property={property.properties[key]} value={currentValue} onChange={onChange} onDelete={onDelete} onAdd={onAdd} />
        </React.Fragment>
      )
    })}
  </div>
}

export default PropertyRenderer
