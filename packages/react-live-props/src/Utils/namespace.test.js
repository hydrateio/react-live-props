const { namespaceName } = require('./namespace')

describe('namespaceName', () => {
  test('should append the name to the parentName separated by .', () => {
    const name = 'TEST_NAME'
    const parentName = 'TEST_PARENT_NAME'
    expect(namespaceName(parentName, name)).toBe(`${parentName}.${name}`)
  })

  test('should return the name if no parentName is given', () => {
    const name = 'TEST_NAME'
    expect(namespaceName(null, name)).toBe(name)
  })
})
