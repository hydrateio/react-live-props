import React from 'react'
import PropTypes from 'prop-types'

export default class NumberInput extends React.PureComponent {
  static propTypes = {
    value: PropTypes.number.isRequired,
    id: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired
  }

  _onChange = (e) => {
    this.props.onChange({
      id: this.props.id,
      newValue: Number(e.target.value)
    })
  }

  render() {
    const { id, value } = this.props
    return <input id={id} type='number' value={value} onChange={this._onChange} />
  }
}
