const { getDisplayName, getRawDisplayName, convertSafeDisplayNameToRaw } = require('./name')

describe('getDisplayName', () => {
  test('returns a string if the component is a string', () => {
    const testName = 'TEST_COMPONENT_NAME'
    expect(getDisplayName(testName)).toBe(testName)
  })

  test('replaces . with - if the component is a string', () => {
    const testName = 'TEST.COMPONENT.NAME'
    const expectedName = 'TEST-COMPONENT-NAME'
    expect(getDisplayName(testName)).toBe(expectedName)
  })

  test('returns the displayName property if it exists', () => {
    const component = {
      displayName: 'TEST_COMPONENT_NAME'
    }
    expect(getDisplayName(component)).toBe(component.displayName)
  })

  test('replaces . with - of the displayName property if it exists', () => {
    const expectedName = 'TEST-COMPONENT-NAME'
    const component = {
      displayName: 'TEST.COMPONENT.NAME'
    }
    expect(getDisplayName(component)).toBe(expectedName)
  })

  test('returns the name property if the component does not have the displayName property set', () => {
    const component = {
      name: 'TEST_COMPONENT_NAME'
    }
    expect(getDisplayName(component)).toBe(component.name)
  })

  test('replaces . with - of the name property if the component does not have the display name property set', () => {
    const expectedName = 'TEST-COMPONENT-NAME'
    const component = {
      name: 'TEST.COMPONENT.NAME'
    }
    expect(getDisplayName(component)).toBe(expectedName)
  })

  test('returns the displayName property if the component has both displayName and name properties set', () => {
    const component = {
      displayName: 'TEST_COMPONENT_DISPLAYNAME',
      name: 'TEST_COMPONENT_NAME'
    }
    expect(getDisplayName(component)).toBe(component.displayName)
  })

  test('replaces . with - of the displayName property if the component has both displayName and name properties set', () => {
    const expectedName = 'TEST-COMPONENT-DISPLAYNAME'
    const component = {
      displayName: 'TEST.COMPONENT.DISPLAYNAME',
      name: 'TEST.COMPONENT.NAME'
    }
    expect(getDisplayName(component)).toBe(expectedName)
  })

  test('returns null if the component has neither displayName nor name properties set', () => {
    const component = {
      otherProp: 'value'
    }
    expect(getDisplayName(component)).toBe(null)
  })

  test('returns the init-capped parsed string description if the component is a symbol', () => {
    const component = Symbol('test')
    expect(getDisplayName(component)).toBe('Test')
  })

  test('returns the init-capped parsed string description split on . and replacing . with - if the component is a symbol', () => {
    const component = Symbol('test1.test2.test3')
    expect(getDisplayName(component)).toBe('Test1-Test2-Test3')
  })
})

describe('getRawDisplayName', () => {
  test('returns a string if the component is a string', () => {
    const testName = 'TEST_COMPONENT_NAME'
    expect(getRawDisplayName(testName)).toBe(testName)
  })

  test('does not replace . with - if the component is a string', () => {
    const testName = 'TEST.COMPONENT.NAME'
    const expectedName = 'TEST.COMPONENT.NAME'
    expect(getRawDisplayName(testName)).toBe(expectedName)
  })

  test('returns the displayName property if it exists', () => {
    const component = {
      displayName: 'TEST_COMPONENT_NAME'
    }
    expect(getRawDisplayName(component)).toBe(component.displayName)
  })

  test('does not replace . with - of the displayName property if it exists', () => {
    const expectedName = 'TEST.COMPONENT.NAME'
    const component = {
      displayName: 'TEST.COMPONENT.NAME'
    }
    expect(getRawDisplayName(component)).toBe(expectedName)
  })

  test('returns the name property if the component does not have the displayName property set', () => {
    const component = {
      name: 'TEST_COMPONENT_NAME'
    }
    expect(getRawDisplayName(component)).toBe(component.name)
  })

  test('does not replace . with - of the name property if the component does not have the display name property set', () => {
    const expectedName = 'TEST.COMPONENT.NAME'
    const component = {
      name: 'TEST.COMPONENT.NAME'
    }
    expect(getRawDisplayName(component)).toBe(expectedName)
  })

  test('returns the displayName property if the component has both displayName and name properties set', () => {
    const component = {
      displayName: 'TEST_COMPONENT_DISPLAYNAME',
      name: 'TEST_COMPONENT_NAME'
    }
    expect(getRawDisplayName(component)).toBe(component.displayName)
  })

  test('does not replace . with - of the displayName property if the component has both displayName and name properties set', () => {
    const expectedName = 'TEST.COMPONENT.DISPLAYNAME'
    const component = {
      displayName: 'TEST.COMPONENT.DISPLAYNAME',
      name: 'TEST.COMPONENT.NAME'
    }
    expect(getRawDisplayName(component)).toBe(expectedName)
  })

  test('returns null if the component has neither displayName nor name properties set', () => {
    const component = {
      otherProp: 'value'
    }
    expect(getRawDisplayName(component)).toBe(null)
  })

  test('returns the init-capped parsed string description if the component is a symbol', () => {
    const component = Symbol('test')
    expect(getRawDisplayName(component)).toBe('Test')
  })

  test('returns the init-capped parsed string description split on . but rejoined with . if the component is a symbol', () => {
    const component = Symbol('test1.test2.test3')
    expect(getRawDisplayName(component)).toBe('Test1.Test2.Test3')
  })
})

describe('convertSafeDisplayNameToRaw', () => {
  test('should replace - with . in the given string', () => {
    expect(convertSafeDisplayNameToRaw('test1-test2-test3')).toBe('test1.test2.test3')
  })
})
