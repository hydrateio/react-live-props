const { tryParseStringAsType, tryConvertTypeToString } = require('./parser')

describe('tryParseStringAsType', () => {
  test('returns the given value if it is not parseable to JSON', () => {
    const initialValue = 'dsfjk:{}fdlsj'
    expect(tryParseStringAsType(initialValue)).toBe(initialValue)
  })

  test('returns the parsed JSON value if it is parseable to a JSON object', () => {
    const initialValue = '{ "prop1": "value1", "prop2": "value2" }'
    expect(tryParseStringAsType(initialValue)).toEqual({ 'prop1': 'value1', 'prop2': 'value2' })
  })

  test('returns the parsed JSON value if it is parseable to a JSON array', () => {
    const initialValue = '[{ "prop1": "value1" }, { "prop1": "value2" }]'
    expect(tryParseStringAsType(initialValue)).toEqual([{ 'prop1': 'value1' }, { 'prop1': 'value2' }])
  })

  test('returns the parsed JSON value if it is parseable to a JSON bool', () => {
    const initialValue = 'true'
    expect(tryParseStringAsType(initialValue)).toBe(true)
  })

  test('returns the parsed JSON value if it is parseable to a JSON number', () => {
    const initialValue = '24.3'
    expect(tryParseStringAsType(initialValue)).toBe(24.3)
  })

  test('returns null if it is parseable to a JSON null', () => {
    const initialValue = 'null'
    expect(tryParseStringAsType(initialValue)).toBe(null)
  })
})

describe('tryConvertTypeToString', () => {
  test('returns the given value if it is not parseable to JSON', () => {
    const initialValue = 'dsfjk:{}fdlsj'
    expect(tryConvertTypeToString(initialValue)).toBe(initialValue)
  })

  test('returns the parsed JSON value if it is parseable to a JSON object', () => {
    const expectedValue = '{"prop1":"value1","prop2":"value2"}'
    const initialValue = { 'prop1': 'value1', 'prop2': 'value2' }
    expect(tryConvertTypeToString(initialValue)).toEqual(expectedValue)
  })

  test('returns the parsed JSON value if it is parseable to a JSON array', () => {
    const expectedValue = '[{"prop1":"value1"},{"prop1":"value2"}]'
    const initialValue = [{ 'prop1': 'value1' }, { 'prop1': 'value2' }]
    expect(tryConvertTypeToString(initialValue)).toEqual(expectedValue)
  })

  test('returns the parsed JSON value if it is parseable to a JSON bool', () => {
    const expectedValue = 'true'
    expect(tryConvertTypeToString(true)).toBe(expectedValue)
  })

  test('returns the parsed JSON value if it is parseable to a JSON number', () => {
    const expectedValue = '24.3'
    expect(tryConvertTypeToString(24.3)).toBe(expectedValue)
  })

  test('returns null if it is parseable to a JSON null', () => {
    const expectedValue = 'null'
    expect(tryConvertTypeToString(null)).toBe(expectedValue)
  })
})
