export const findSelectedType = (availableTypes, selectedName) => {
  const matchedItems = availableTypes.filter(type => {
    if (typeof type === 'string') return type === selectedName

    return type.name === selectedName
  })

  if (matchedItems.length > 0) return matchedItems[0]

  return null
}
