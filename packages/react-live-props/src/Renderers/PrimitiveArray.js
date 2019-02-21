import React from 'react'
import { AddButton, DeleteButton } from '../Components'
import FieldRenderer from './Field'
import { namespaceName } from '../Utils'

const PrimitiveArrayRenderer = ({ parentName, name, property, value, onChange, onDelete, onAdd, availableTypes }) => {
  const newParentName = namespaceName(parentName, name)

  return <div className='rlp-prop'>
    <div className='rlp-prop-header'>
      <strong className='rlp-prop-name'>{name}</strong>
      <div className='rlp-prop-header-action'>
        <AddButton onClick={() => onAdd(newParentName, property.items.type)} />
      </div>
    </div>
    {property.description && (
      <legend className='rlp-prop-description'>{property.description}</legend>
    )}
    <div className='rlp-prop-input'>
      {value && value.map((item, idx) => (
        <div className='rlp-prop-list-item' key={namespaceName(newParentName, `value-${idx}`)}>
          <div className='rlp-prop-list-item-input'>
            <FieldRenderer parentName={newParentName} name={idx} type={property.items.type} value={item} onChange={onChange} onDelete={onDelete} options={property.enum} onAdd={onAdd} availableTypes={availableTypes} />
          </div>
          <DeleteButton onClick={() => onDelete(namespaceName(newParentName, idx))} />
        </div>
      ))}
    </div>
  </div>
}

export default PrimitiveArrayRenderer
