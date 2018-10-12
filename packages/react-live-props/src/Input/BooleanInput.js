import React from 'react'
import PropTypes from 'prop-types'

export default class BooleanInput extends React.PureComponent {
  static propTypes = {
    value: PropTypes.bool.isRequired,
    id: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired
  }

  _onChange = (e) => {
    this.props.onChange({
      id: this.props.id,
      newValue: e.target.checked
    })
  }

  render() {
    const { id, value } = this.props
    return <input id={id} type='checkbox' checked={value} onChange={this._onChange} />
  }
}
