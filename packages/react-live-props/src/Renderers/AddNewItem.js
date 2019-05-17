import React from 'react'
import PropTypes from 'prop-types'

class AddNewItem extends React.Component {
  static propTypes = {
    children: PropTypes.oneOfType([PropTypes.string, PropTypes.node, PropTypes.func]).isRequired,
    onChange: PropTypes.func.isRequired,
    defaultValue: PropTypes.any,
    name: PropTypes.string
  }

  constructor(props, context) {
    super(props, context)

    this.state = {
      currentValue: this.props.defaultValue
    }
  }

  componentDidMount() {
    console.log('mounting add new item')
  }

  onChange = (name, newValue) => {
    this.setState({
      currentValue: newValue
    })
  }

  onAdd = () => {
    this.props.onChange(this.props.name, this.state.currentValue)
    this.setState({
      currentValue: this.props.defaultValue
    })
  }

  render() {
    const Children = this.props.children

    return (
      <div>
        <Children {...this.props} onChange={this.onChange} currentValue={this.state.currentValue} />
        <button type='button' onClick={this.onAdd}>Add</button>
      </div>
    )
  }
}

export default AddNewItem
