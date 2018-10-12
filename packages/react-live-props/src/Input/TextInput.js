import React from 'react'
import PropTypes from 'prop-types'

export default class TextInput extends React.PureComponent {
  static propTypes = {
    value: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired
  }

  _onChange = (e) => {
    this.props.onChange({
      id: this.props.id,
      newValue: e.target.value
    })
  }

  render() {
    const { id, value } = this.props
    return <input style={{width: '100%'}} id={id} type='text' value={value} onChange={this._onChange} />
  }
}
