import React from 'react'
import { namespaceName, tryConvertTypeToString, tryParseStringAsType } from '../Utils'
import { SchemaContext } from '../Context'
import PropTypes from 'prop-types'
import { SketchPicker } from 'react-color'

class FieldRenderer extends React.Component {
  static propTypes = {
    parentName: PropTypes.string.isRequired,
    name: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    type: PropTypes.string.isRequired,
    value: PropTypes.any,
    onChange: PropTypes.func.isRequired,
    options: PropTypes.array,
    className: PropTypes.string
  }

  state = {
    currentEditorScheme: ''
  }

  changeEditorScheme = (e) => {
    this.setState({
      currentEditorScheme: e.target.value
    })
  }

  render() {
    const { parentName, name, options, value, onChange, type, className } = this.props

    const uniqueName = namespaceName(parentName, name)

    if (options) {
      return (
        <SchemaContext.Consumer>
          {({ values }) => (
            <select key={uniqueName} name={uniqueName} className={className} value={value} onChange={(e) => onChange(uniqueName, e.target.value, values)}>
              {options.map(option => <option key={option} value={option}>{option}</option>)}
            </select>
          )}
        </SchemaContext.Consumer>
      )
    }

    if (type === 'boolean') {
      return (
        <SchemaContext.Consumer>
          {({ values }) => (
            <input type='checkbox' key={uniqueName} className={className} name={uniqueName} checked={value} onChange={(e) => onChange(uniqueName, e.target.checked, values)} />
          )}
        </SchemaContext.Consumer>
      )
    }

    if (type === 'number') {
      return (
        <SchemaContext.Consumer>
          {({ values }) => (
            <input type='number' key={uniqueName} className={className} name={uniqueName} value={value} onChange={(e) => onChange(uniqueName, e.target.value, values)} />
          )}
        </SchemaContext.Consumer>
      )
    }

    if (type === 'string') {
      if (this.state.currentEditorScheme === 'color') {
        return (
          <SchemaContext.Consumer>
            {({ values }) => (
              <div className={className}>
                <SketchPicker color={value} onChange={(newColor) => onChange(uniqueName, newColor.hex, values)} onChangeComplete={(newColor) => onChange(uniqueName, newColor.hex, values)} />
              </div>
            )}
          </SchemaContext.Consumer>
        )
      }

      return (
        <SchemaContext.Consumer>
          {({ values }) => (
            <div className={className}>
              <input type='text' key={uniqueName} name={uniqueName} value={value} onChange={(e) => onChange(uniqueName, e.target.value, values)} />
            </div>
          )}
        </SchemaContext.Consumer>
      )
    }

    if (this.state.currentEditorScheme === 'color') {
      return (
        <SchemaContext.Consumer>
          {({ values }) => (
            <div className={className}>
              <SketchPicker color={value} onChange={(newColor) => onChange(uniqueName, newColor.hex, values)} onChangeComplete={(newColor) => onChange(uniqueName, newColor.hex, values)} />
            </div>
          )}
        </SchemaContext.Consumer>
      )
    }

    return (
      <SchemaContext.Consumer>
        {({ values }) => (
          <div className={className}>
            <input type='text' key={uniqueName} name={uniqueName} value={tryConvertTypeToString(value)} onChange={(e) => onChange(uniqueName, tryParseStringAsType(e.target.value), values)} />
          </div>
        )}
      </SchemaContext.Consumer>
    )
  }
}

export default FieldRenderer
