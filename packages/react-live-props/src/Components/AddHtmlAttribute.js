import React from 'react'
import PropTypes from 'prop-types'
import { SchemaContext } from '../Context'
import { tryParseStringAsType } from '../Utils'
import AddButton from './AddButton'
import PropWrapper from './PropWrapper'

import styles from './AddHtmlAttribute.css'

const AddHtmlAttribute = ({ pendingAttributeName, pendingAttributeValue, onAddProperty, onChange }) => (
  <SchemaContext.Consumer>
    {({ editingComponent, values, editingComponentPath }) => (
      <PropWrapper name=''>
        <div className={styles.attributeForm}>
          <input type='text' value={pendingAttributeName} placeholder='Attribute name' onChange={(e) => onChange({ pendingAttributeName: e.target.value })} />
          <input type='text' value={pendingAttributeValue} placeholder='Attribute value' onChange={(e) => onChange({ pendingAttributeValue: e.target.value })} />
          <AddButton onClick={() => onAddProperty(editingComponent, editingComponentPath, values, pendingAttributeName, tryParseStringAsType(pendingAttributeValue))} />
        </div>
      </PropWrapper>
    )}
  </SchemaContext.Consumer>
)

AddHtmlAttribute.propTypes = {
  pendingAttributeName: PropTypes.string.isRequired,
  pendingAttributeValue: PropTypes.string.isRequired,
  onAddProperty: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired
}

export default AddHtmlAttribute
