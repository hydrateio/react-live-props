export const getDisplayName = (value) => {
  if (typeof value === 'string') return value

  if (value.type) {
    if (typeof value.type === 'string') return value.type

    if (value.type.toString() === 'Symbol(react.fragment)') return 'React.Fragment'

    return value.type.displayName || value.type.name || 'Component'
  }

  return value.displayName || value.name || 'Component'
}
