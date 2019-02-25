import React from 'react'
import { AddButton, DeleteButton } from '../Components'
import { SchemaContext } from '../Context'
import FieldRenderer from './Field'
import { namespaceName } from '../Utils'
import PropTypes from 'prop-types'
import cs from 'classnames'

import styles from './styles.css'

const PrimitiveArrayRenderer = ({ parentName, name, property, value, onChange, onDelete, onAdd, availableTypes }) => {
  const newParentName = namespaceName(parentName, name)

  return (
    <SchemaContext>
      {({ values }) => (
        <div className={cs('rlpProp', styles.rlpProp)}>
          <div className={cs('rlpPropHeader', styles.rlpPropHeader)}>
            <strong className={cs('rlpPropName', styles.rlpPropName)}>{name}</strong>
            <div className={cs('rlpPropHeaderAction', styles.rlpPropHeaderAction)}>
              <AddButton onClick={() => onAdd(newParentName, property.items.type, values)} />
            </div>
          </div>
          {property.description && (
            <legend className={cs('rlpPropDescription', styles.rlpPropDescription)}>{property.description}</legend>
          )}
          <div className={cs('rlpPropInput', styles.rlpPropInput)}>
            {value && value.map((item, idx) => (
              <div className={cs('rlpPropListItem', styles.rlpPropListItem)} key={namespaceName(newParentName, `value-${idx}`)}>
                <div className={cs('rlpPropListItemInput', styles.rlpPropListItemInput)}>
                  <FieldRenderer parentName={newParentName} name={idx} type={property.items.type} value={item} onChange={onChange} onDelete={onDelete} options={property.enum} onAdd={onAdd} availableTypes={availableTypes} />
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

PrimitiveArrayRenderer.propTypes = {
  parentName: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  property: PropTypes.object.isRequired,
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
  availableTypes: PropTypes.array
}

export default PrimitiveArrayRenderer
