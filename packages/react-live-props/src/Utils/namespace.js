export const namespaceName = (parentName, name) => {
  if (parentName) return `${parentName}.${name}`

  return name
}
