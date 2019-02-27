const { findSelectedType, buildDefaultValuesForType, processReactElementToValue, hasChildren, findNodeProperties } = require('./types')

describe('findSelectedType', () => {
  test('returns React.Fragment if the type name is React-Fragment', () => {
    const actual = findSelectedType([], 'React-Fragment')
    expect(actual.toString()).toBe('Symbol(react.fragment)')
  })

  test('returns the matched item if the item is a string that matches the given name', () => {
    const availableTypes = ['test1', 'test2', 'test3']
    const actual = findSelectedType(availableTypes, 'test2')
    expect(actual).toBe('test2')
  })

  test('returns only the first matched item if the item is a string that matches the given name', () => {
    const availableTypes = ['test1', 'test2', 'test3', 'test2', 'test3', 'test2']
    const actual = findSelectedType(availableTypes, 'test2')
    expect(actual).toBe('test2')
  })

  test('returns the matched item if the displayName of the item matches the given name', () => {
    const availableTypes = ['test1', { prop1: 'value1', displayName: 'test2' }, 'test3']
    const actual = findSelectedType(availableTypes, 'test2')
    expect(actual).toEqual({ prop1: 'value1', displayName: 'test2' })
  })

  test('returns the matched item if the name of the item matches the given name', () => {
    const availableTypes = ['test1', { prop1: 'value1', name: 'test2' }, 'test3']
    const actual = findSelectedType(availableTypes, 'test2')
    expect(actual).toEqual({ prop1: 'value1', name: 'test2' })
  })

  test('returns null if none of the items match the given name', () => {
    const availableTypes = ['test1', { prop1: 'value1', name: 'test2' }, 'test3']
    const actual = findSelectedType(availableTypes, 'test4')
    expect(actual).toBe(null)
  })
})

describe('buildDefaultValuesForType', () => {
  test('populates default values for props based on the given schema', () => {
    const schema = {
      ComponentName: {
        properties: {
          prop1: {
            type: 'string'
          },
          prop2: {
            type: 'boolean'
          },
          prop3: {
            type: 'number'
          }
        },
        required: ['prop1', 'prop2', 'prop3'],
        title: 'ComponentName',
        type: 'object'
      }
    }
    buildDefaultValuesForType(schema, 'ComponentName').then(data => {
      const prop1Correct = typeof data.prop1 === 'string'
      const prop2Correct = typeof data.prop2 === 'boolean'
      const prop3Correct = typeof data.prop3 === 'number'
      expect(prop1Correct && prop2Correct && prop3Correct).toBe(true)
    })
  })

  test('populates an empty array for children if the type is an array', () => {
    const schema = {
      ComponentName: {
        properties: {
          children: {
            type: 'array'
          }
        },
        required: [],
        title: 'ComponentName',
        type: 'object'
      }
    }
    buildDefaultValuesForType(schema, 'ComponentName').then(data => {
      expect(data.children).toEqual([])
    })
  })

  test('populates an empty object for children if the type is an object', () => {
    const schema = {
      ComponentName: {
        properties: {
          children: {
            type: 'object'
          }
        },
        required: [],
        title: 'ComponentName',
        type: 'object'
      }
    }
    buildDefaultValuesForType(schema, 'ComponentName').then(data => {
      expect(data.children).toEqual({})
    })
  })
})

describe('processReactElementToValue', () => {
  test('returns a @@TEXT element if the element is a string', () => {
    const element = 'testing'
    const actual = processReactElementToValue(null, element)
    expect(actual).toEqual({
      type: '@@TEXT',
      '@@TEXT': {
        text: element
      }
    })
  })

  // TODO: more tests
})

describe('hasChildren', () => {
  test('returns false if the component is null', () => {
    expect(hasChildren(null)).toBe(false)
  })

  test('returns false if component.children is null', () => {
    expect(hasChildren({ children: null })).toBe(false)
  })

  test('returns false if component.children is a string', () => {
    expect(hasChildren({ children: 'test' })).toBe(false)
  })

  test('returns false if component.children is a bool', () => {
    expect(hasChildren({ children: true })).toBe(false)
  })

  test('returns false if component.children is a number', () => {
    expect(hasChildren({ children: 24 })).toBe(false)
  })

  test('returns false if component.children is an object with 0 keys', () => {
    expect(hasChildren({ children: {} })).toBe(false)
  })

  test('returns true if component.children is an object with more than 0 keys', () => {
    expect(hasChildren({ children: { key1: 'value1' } })).toBe(true)
  })

  test('returns false if component.children is an array with 0 items', () => {
    expect(hasChildren({ children: [] })).toBe(false)
  })

  test('returns true if component.children is an array with more than 0 items', () => {
    expect(hasChildren({ children: [{ key1: 'value1' }] })).toBe(true)
  })
})

describe('findNodeProperties', () => {
  test('returns an array containing only children if the element is in the htmlTypes array', () => {
    const actual = findNodeProperties('htmlElement', {}, ['htmlElement'])
    expect(actual).toEqual(['children'])
  })

  test('returns an empty array if the element is not in the htmlTypes array and no docgenInfo was provided', () => {
    const actual = findNodeProperties('element', null, ['htmlElement'])
    expect(actual).toEqual([])
  })

  test('returns an empty array if the element is not in the htmlTypes array and no docgenInfo.props was provided', () => {
    const actual = findNodeProperties('element', {}, ['htmlElement'])
    expect(actual).toEqual([])
  })

  test('returns an empty array if given props do not include any properties that have node or arrayOf/node types', () => {
    const actual = findNodeProperties('element', { props: { key1: { type: { name: 'type1' } }, key2: { type: { name: 'type2' } } } }, ['htmlElement'])
    expect(actual).toEqual([])
  })

  test('returns an array containing the given props that include any properties that have node types', () => {
    const actual = findNodeProperties('element', { props: { key1: { type: { name: 'node' } }, key2: { type: { name: 'type2' } } } }, ['htmlElement'])
    expect(actual).toEqual(['key1'])
  })

  test('returns an array containing the given props that include any properties that have arrayOf/node types', () => {
    const actual = findNodeProperties('element', { props: { key1: { type: { name: 'type1' } }, key2: { type: { name: 'arrayOf', value: { name: 'node' } } } } }, ['htmlElement'])
    expect(actual).toEqual(['key2'])
  })
})
