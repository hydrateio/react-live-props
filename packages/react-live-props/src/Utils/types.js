import jsf from 'json-schema-faker'

jsf.option({ alwaysFakeOptionals: true, minItems: 1, maxItems: 2 })

export const findSelectedType = (availableTypes, selectedName) => {
  const matchedItems = availableTypes.filter(type => {
    if (typeof type === 'string') return type === selectedName

    return type.name === selectedName
  })

  if (matchedItems.length > 0) return matchedItems[0]

  return null
}

export const buildDefaultValuesForType = async (schema, componentName) => {
  // something in jsf.resolve is mutating the original schema
  // for anyOf properties, so give them a copy of the properties
  const values = await jsf.resolve(JSON.parse(JSON.stringify(schema[componentName])))

  if (schema[componentName].properties.children) {
    if (schema[componentName].properties.children.type === 'array') {
      values.children = []
    } else if (schema[componentName].properties.children.type === 'object') {
      values.children = {}
    }
  }

  return values
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
