import React from 'react'
import PrimitiveArrayRenderer from './PrimitiveArray'
import FieldRenderer from './Field'
import { AddButton, DeleteButton } from '../Components'
import { SchemaContext } from '../Context'
import { namespaceName, tryParseStringAsType, tryConvertTypeToString, buildDefaultValuesForType } from '../Utils'
import PropTypes from 'prop-types'

const onChangeType = async (schema, uniqueName, value, onChange) => {
  const typeValue = await buildDefaultValuesForType(schema, value)
  onChange(uniqueName, { type: value, [value]: typeValue })
}

const PropertyRenderer = ({ parentName, name, property, value, onChange, onDelete, onAdd }) => {
  const singleFieldTypes = ['number', 'boolean', 'string']

  if (name === 'children') {
    const uniqueName = namespaceName(parentName, name)

    if (property.type === 'array') {
      const valueOrDefault = value || []
      return <SchemaContext>
        {({ schema, availableTypes }) => {
          if (availableTypes.length === 0) return null

          return (
            <React.Fragment>
              {valueOrDefault.map((child, idx) => {
                return (
                  <div className='rlp-prop' key={`${child.type}-${idx}`}>
                    <div className='rlp-prop-header'>
                      <strong className='rlp-prop-name'>{name}</strong>
                      <div className='rlp-prop-input'>
                        <select key={`${uniqueName}.${idx}`} name={`${uniqueName}.${idx}`} value={child.type} onChange={(e) => onChangeType(schema, uniqueName, e.target.value, onChange)}>
                          <option value=''>none</option>
                          {availableTypes.map(availableType => {
                            if (typeof availableType === 'string') return <option key={availableType} value={availableType}>{availableType}</option>

                            return <option key={availableType} value={availableType.name}>{availableType.name}</option>
                          })}
                        </select>
                      </div>
                    </div>
                  </div>
                )
              })}

              <div className='rlp-prop'>
                <div className='rlp-prop-header'>
                  <strong className='rlp-prop-name'>{name}</strong>
                  <div className='rlp-prop-input'>
                    <select key={`${uniqueName}.${valueOrDefault.length}`} name={`${uniqueName}.${valueOrDefault.length}`} value='' onChange={(e) => onChangeType(schema, `${uniqueName}.${valueOrDefault.length}`, e.target.value, onChange)}>
                      <option value=''>none</option>
                      {availableTypes.map(availableType => {
                        if (typeof availableType === 'string') return <option key={availableType} value={availableType}>{availableType}</option>

                        return <option key={availableType} value={availableType.name}>{availableType.name}</option>
                      })}
                    </select>
                  </div>
                </div>
              </div>
            </React.Fragment>
          )
        }}
      </SchemaContext>
    }

    return <SchemaContext>
      {({ schema, availableTypes }) => {
        if (availableTypes.length === 0) return null

        return (
          <div className='rlp-prop'>
            <div className='rlp-prop-header'>
              <strong className='rlp-prop-name'>{name}</strong>
              <div className='rlp-prop-input'>
                <select key={uniqueName} name={uniqueName} value={value.type} onChange={(e) => onChangeType(schema, uniqueName, e.target.value, onChange)}>
                  <option value=''>none</option>
                  {availableTypes.map(availableType => {
                    if (typeof availableType === 'string') return <option key={availableType} value={availableType}>{availableType}</option>

                    return <option key={availableType} value={availableType.name}>{availableType.name}</option>
                  })}
                </select>
              </div>
            </div>
          </div>
        )
      }}
    </SchemaContext>
  }

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

  const valueOrDefault = value || ''
  return <div className='rlp-prop'>
    <div className='rlp-prop-header'>
      <strong className='rlp-prop-name'>{name}</strong>
      <div className='rlp-prop-input'>
        <input type='text' name={name} value={tryConvertTypeToString(valueOrDefault)} onChange={(e) => onChange(namespaceName(parentName, name), tryParseStringAsType(e.target.value))} />
      </div>
    </div>
    {property.description && (
      <legend className='rlp-prop-description'>{property.description}</legend>
    )}
  </div>
}

PropertyRenderer.propTypes = {
  parentName: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  property: PropTypes.object.isRequired,
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired
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

ObjectArrayRenderer.propTypes = {
  parentName: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  property: PropTypes.object.isRequired,
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired
}

export const ObjectRenderer = ({ parentName, name, property, value, onChange, onDelete, onAdd }) => {
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
        <PropertyRenderer key={namespaceName(newParentName, idx)} parentName={newParentName} name={key} property={property.properties[key]} value={currentValue} onChange={onChange} onDelete={onDelete} onAdd={onAdd} />
      )
    })}
  </div>
}

ObjectRenderer.propTypes = {
  parentName: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  property: PropTypes.object.isRequired,
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired
}

export default PropertyRenderer
