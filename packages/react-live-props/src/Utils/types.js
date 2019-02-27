import React from 'react'
import jsf from 'json-schema-faker'
import { getDisplayName } from './name'

jsf.option({ alwaysFakeOptionals: true, minItems: 1, maxItems: 2 })

export const findSelectedType = (availableTypes, selectedName) => {
  if (selectedName === 'React-Fragment' || selectedName === 'React.Fragment') return React.Fragment

  const matchedItems = availableTypes.filter(type => {
    if (typeof type === 'string') return type === selectedName

    return getDisplayName(type) === selectedName
  })

  if (matchedItems.length > 0) return matchedItems[0]

  return null
}

export const buildDefaultValuesForType = async (schema, componentName, generateFakePropValues) => {
  // something in jsf.resolve is mutating the original schema
  // for anyOf properties, so give them a copy of the properties
  let values = {}
  if (generateFakePropValues) {
    values = await jsf.resolve(JSON.parse(JSON.stringify(schema[componentName])))
  } else {
    Object.keys(schema[componentName].properties).forEach(prop => {
      values[prop] = null
    })
  }

  if (schema[componentName].properties.children) {
    if (schema[componentName].properties.children.type === 'array') {
      values.children = []
    } else if (schema[componentName].properties.children.type === 'object') {
      values.children = {}
    }
  }

  return values
}

export const processReactElementToValue = (schema, element, allDocgenInfo, htmlTypes) => {
  if (typeof element === 'string') {
    return {
      type: '@@TEXT',
      '@@TEXT': {
        text: element
      }
    }
  }

  if (element.type === '@@TEXT') return element

  const elementDisplayName = getDisplayName(element.type)
  const nodeProps = findNodeProperties(element, allDocgenInfo[elementDisplayName], htmlTypes)
  const nodeValues = {}
  if (nodeProps.length > 0) {
    nodeProps.forEach(nodeProp => {
      if (!element.props[nodeProp]) return

      if (Array.isArray(element.props[nodeProp])) {
        nodeValues[nodeProp] = element.props[nodeProp].map(child => processReactElementToValue(schema, child, allDocgenInfo, htmlTypes))
      } else {
        nodeValues[nodeProp] = processReactElementToValue(schema, element.props[nodeProp], allDocgenInfo, htmlTypes)
      }
    })
  }

  Object.keys(element.props).filter(name => name !== 'children').forEach(prop => {
    if (schema[elementDisplayName] && schema[elementDisplayName].properties && schema[elementDisplayName].properties[prop]) return

    // default unknown properties to any so they get parsed to JSON if possible
    schema[elementDisplayName].properties[prop] = { type: 'any' }
  })

  return {
    type: elementDisplayName,
    [elementDisplayName]: {
      ...element.props,
      ...nodeValues
    }
  }
}

export const hasChildren = (component) => {
  if (!component) return false

  if (!component.children) return false

  if (Array.isArray(component.children)) {
    return component.children.length > 0
  }

  if (typeof component.children === 'object') {
    return Object.keys(component.children).length > 0
  }

  return false
}

export const findNodeProperties = (component, docgenInfo, htmlTypes) => {
  if (htmlTypes.includes(component)) return ['children']

  if (!docgenInfo || !docgenInfo.props) return []

  return Object.keys(docgenInfo.props).filter(prop => {
    if (docgenInfo.props[prop].type.name === 'node') return true

    if (docgenInfo.props[prop].type.name === 'arrayOf' && docgenInfo.props[prop].type.value.name === 'node') return true

    return false
  })
}
