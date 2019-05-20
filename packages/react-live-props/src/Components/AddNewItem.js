import React from 'react'
import PropTypes from 'prop-types'
import SaveButton from './SaveButton'
import cs from 'classnames'

import styles from './AddNewItem.css'

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
      <div className={cs('rlpAddNewItem', styles.addNewItem)}>
        <SaveButton onClick={this.onAdd} />
        <div className={styles.addNewItemContents}>
          <Children {...this.props} onChange={this.onChange} currentValue={this.state.currentValue} />
        </div>
      </div>
    )
  }
}

export default AddNewItem
