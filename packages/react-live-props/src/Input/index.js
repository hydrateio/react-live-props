import React from 'react'
import PropTypes from 'prop-types'
import TextInput from './TextInput'
import BooleanInput from './BooleanInput'

export default class Input extends React.Component {
  static propTypes = {
    liveProp: PropTypes.shape({
      value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool
      ]).isRequired,
      id: PropTypes.string.isRequired
    }),
    type: PropTypes.oneOf(['text', 'boolean']),
    onChange: PropTypes.func.isRequired
  }

  render() {
    const { type, liveProp, onChange } = this.props
    switch (type) {
      case 'text':
        return <TextInput {...liveProp} onChange={onChange} />
      case 'boolean':
        return <BooleanInput {...liveProp} onChange={onChange} />
    }
  }
}
