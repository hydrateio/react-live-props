export const findComponentProperties = (props) => {
  return Object.keys(props).filter(prop => {
    if (props[prop].type.name === 'node') return true

    if (props[prop].type.name === 'element') return true

    if (props[prop].type.name === 'arrayOf' && (props[prop].type.value.name === 'node' || props[prop].type.value.name === 'element')) return true

    return false
  })
}

export const recurseDocgenForProp = (parentName, docgenInfo) => {
  return parentName.split('.').reduce((docgenForName, namePart) => {
    if (!docgenForName || !docgenForName[namePart]) return null

    return docgenForName[namePart].props
  }, docgenInfo)
}
