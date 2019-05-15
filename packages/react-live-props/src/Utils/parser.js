export const tryParseStringAsType = (value) => {
  try {
    return JSON.parse(value)
  } catch (e) {
    return value
  }
}

export const tryConvertTypeToString = (value) => {
  if (typeof value === 'string') return value

  try {
    return JSON.stringify(value)
  } catch (e) {
    return value
  }
}
