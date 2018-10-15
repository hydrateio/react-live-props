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
      ]).isRequired,
      id: PropTypes.string.isRequired
    }),
    type: PropTypes.oneOf(['text', 'string', 'boolean', 'bool', 'number']),
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
        return <TextInput id={liveProp.id} value={String(liveProp.value)} onChange={onChange} />
    }
  }
}
