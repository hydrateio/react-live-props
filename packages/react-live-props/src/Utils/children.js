export const hasChildren = (component) => {
  if (!component) return false;

  if (!component.children) return false

  if (typeof component.children === 'object') {
    if (Object.keys(component.children).length === 0) return false
  }

  return true
}
