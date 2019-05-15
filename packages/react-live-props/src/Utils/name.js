export const getDisplayName = (Component) => {
  if (typeof Component === 'string') return Component.replace(/\./g, '-')

  if (typeof Component === 'symbol') {
    const symbolString = Component.toString()
    const sanitizedName = symbolString.replace('Symbol(', '').replace(')', '')
    const nameParts = sanitizedName.split('.')
    return nameParts.map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('-')
  }

  const name = Component.displayName || Component.name

  if (name) {
    return name.replace(/\./g, '-')
  }

  return null
}

export const getRawDisplayName = (Component) => {
  if (typeof Component === 'string') return Component

  if (typeof Component === 'symbol') {
    const symbolString = Component.toString()
    const sanitizedName = symbolString.replace('Symbol(', '').replace(')', '')
    const nameParts = sanitizedName.split('.')
    return nameParts.map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('.')
  }

  return Component.displayName || Component.name || null
}

export const convertSafeDisplayNameToRaw = (displayName) => displayName.replace(/-/g, '.')
