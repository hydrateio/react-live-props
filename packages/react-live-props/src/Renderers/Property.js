import React from 'react'
import PrimitiveArrayRenderer from './PrimitiveArray'
import FieldRenderer from './Field'
import { AddButton, DeleteButton } from '../Components'
import { SchemaContext } from '../Context'
import { namespaceName, tryParseStringAsType, tryConvertTypeToString, buildDefaultValuesForType } from '../Utils'
import PropTypes from 'prop-types'
import cs from 'classnames'

import styles from './styles.css'

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
                  <div className={cs('rlpProp', styles.rlpProp)} key={`${child.type}-${idx}`}>
                    <div className={cs('rlpPropHeader', styles.rlpPropHeader)}>
                      <strong className={cs('rlpPropName', styles.rlpPropName)}>{name}</strong>
                      <div className={cs('rlpPropInput', styles.rlpPropInput)}>
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

              <div className={cs('rlpProp', styles.rlpProp)}>
                <div className={cs('rlpPropHeader', styles.rlpPropHeader)}>
                  <strong className={cs('rlpPropName', styles.rlpPropName)}>{name}</strong>
                  <div className={cs('rlpPropInput', styles.rlpPropInput)}>
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
          <div className={cs('rlpProp', styles.rlpProp)}>
            <div className={cs('rlpPropHeader', styles.rlpPropHeader)}>
              <strong className={cs('rlpPropName', styles.rlpPropName)}>{name}</strong>
              <div className={cs('rlpPropInput', styles.rlpPropInput)}>
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
    return <div className={cs('rlpProp', styles.rlpProp)}>
      <div className={cs('rlpPropHeader', styles.rlpPropHeader)}>
        <strong className={cs('rlpPropName', styles.rlpPropName)}>{name}</strong>
        <div className={cs('rlpPropInput', styles.rlpPropInput)}>
          <FieldRenderer parentName={parentName} name={name} type={property.type} value={currentValue} onChange={onChange} options={property.enum} onDelete={onDelete} onAdd={onAdd} />
        </div>
      </div>
      {property.description && (
        <legend className={cs('rlpPropDescription', styles.rlpPropDescription)}>{property.description}</legend>
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

    return <div className={cs('rlpProp', styles.rlpProp)}>
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
  return <div className={cs('rlpProp', styles.rlpProp)}>
    <div className={cs('rlpPropHeader', styles.rlpPropHeader)}>
      <strong className={cs('rlpPropName', styles.rlpPropName)}>{name}</strong>
      <div className={cs('rlpPropInput', styles.rlpPropInput)}>
        <input type='text' name={name} value={tryConvertTypeToString(valueOrDefault)} onChange={(e) => onChange(namespaceName(parentName, name), tryParseStringAsType(e.target.value))} />
      </div>
    </div>
    {property.description && (
      <legend className={cs('rlpPropDescription', styles.rlpPropDescription)}>{property.description}</legend>
    )}
  </div>
}

PropertyRenderer.propTypes = {
  parentName: PropTypes.string.isRequired,
  name: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.number.isRequired]),
  property: PropTypes.object.isRequired,
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired
}

export const ObjectArrayRenderer = ({ parentName, name, property, value, onChange, onDelete, onAdd }) => {
  const newParentName = namespaceName(parentName, name)

  return (
    <SchemaContext>
      {({ values }) => (
        <div className={cs('rlpProp', styles.rlpProp)}>
          <div className={cs('rlpPropHeader', styles.rlpPropHeader)}>
            <strong className={cs('rlpPropName', styles.rlpPropName)}>{name}</strong>
            <div className={cs('rlpPropHeaderAction', styles.rlpPropHeaderAction)}>
              <AddButton onClick={() => onAdd(newParentName, 'object', values)} />
            </div>
          </div>
          {property.description && (
            <legend className={cs('rlpPropDescription', styles.rlpPropDescription)}>{property.description}</legend>
          )}
          <div className={cs('rlpPropInput', styles.rlpPropInput)}>
            {value && value.map((item, idx) => (
              <div className={cs('rlpPropListItem', styles.rlpPropListItem)} key={namespaceName(newParentName, `value-${idx}`)}>
                <div className={cs('rlpPropListItemInput', styles.rlpPropListItemInput)}>
                  <ObjectRenderer parentName={newParentName} name={idx} value={item} property={property.items} onChange={onChange} onDelete={onDelete} onAdd={onAdd} />
                </div>
                <DeleteButton onClick={() => onDelete(namespaceName(newParentName, idx), values)} />
              </div>
            ))}
          </div>
        </div>
      )}
    </SchemaContext>
  )
}

ObjectArrayRenderer.propTypes = {
  parentName: PropTypes.string.isRequired,
  name: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.number.isRequired]),
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

  return <div className={cs('rlpProp', styles.rlpProp)}>
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
  name: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.number.isRequired]),
  property: PropTypes.object.isRequired,
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired
}

export const AddHtmlAttributeRenderer = ({ pendingAttributeName, pendingAttributeValue, onAddProperty, onChange }) => (
  <SchemaContext>
    {({ schema, values, editingComponent, editingComponentPath }) => (
      <div className={cs('rlpProp', styles.rlpProp)}>
        <div className={cs('rlpPropHeader', styles.rlpPropHeader)}>
          <div className={cs('rlpPropName', styles.rlpPropName)}>
            <input type='text' value={pendingAttributeName} onChange={(e) => onChange({ pendingAttributeName: e.target.value })} />
          </div>
          <div className={cs('rlpPropInput', styles.rlpPropInput)}>
            <input type='text' value={pendingAttributeValue} onChange={(e) => onChange({ pendingAttributeValue: e.target.value })} />
          </div>
          <div className={cs('rlpPropHeaderAction', styles.rlpPropHeaderAction)}>
            <AddButton onClick={() => onAddProperty(editingComponent, editingComponentPath, schema, values, pendingAttributeName, tryParseStringAsType(pendingAttributeValue))} />
          </div>
        </div>
      </div>
    )}
  </SchemaContext>
)

AddHtmlAttributeRenderer.propTypes = {
  pendingAttributeName: PropTypes.string.isRequired,
  pendingAttributeValue: PropTypes.string.isRequired,
  onAddProperty: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired
}

export default PropertyRenderer
