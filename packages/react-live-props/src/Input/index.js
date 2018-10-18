import React from 'react'
import PropTypes from 'prop-types'
import TextInput from './TextInput'
import BooleanInput from './BooleanInput'
import NumberInput from './NumberInput'

export default class Input extends React.Component {
  static propTypes = {
    liveProp: PropTypes.shape({
      value: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
        PropTypes.bool
      ]),
      id: PropTypes.string.isRequired
    }),
    type: PropTypes.string,
    onChange: PropTypes.func.isRequired
  }

  render() {
    const { type, liveProp, onChange } = this.props
    switch (type) {
      case 'text':
      case 'string':
        return <TextInput {...liveProp} onChange={onChange} />
      case 'bool':
      case 'boolean':
        return <BooleanInput {...liveProp} onChange={onChange} />
      case 'number':
        return <NumberInput {...liveProp} onChange={onChange} />
      default:
        return <span>Unhandled PropType</span>
    }
  }
}
