import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Input from '../Input'

export class ReactLiveProps extends Component {
  static propTypes = {
    children: PropTypes.func,
    value: PropTypes.object
  }

  constructor(props) {
    super(props)
    this.newContext = React.createContext()
    const liveProps = Object.keys(this.props.value).reduce((props, key) => {
      props[key] = {
        ...this.props.value[key],
        value: this.props.value[key].defaultValue,
        id: key
      }
      return props
    }, {})
    this.state = {
      schema: null,
      liveProps
    }
  }

  _onChange = ({ id, newValue }) => {
    this.setState({
      liveProps: {
        ...this.state.liveProps,
        [id]: {
          ...this.state.liveProps[id],
          value: newValue
        }
      }
    })
  }

  get inputRows() {
    return Object.keys(this.state.liveProps).map(propKey => {
      const liveProp = this.state.liveProps[propKey]
      return (
        <tr key={propKey}>
          <td>
            <label htmlFor={liveProp.id}>{liveProp.description}</label>
          </td>
          <td>
            <Input type={liveProp.type} liveProp={liveProp} onChange={this._onChange} />
          </td>
        </tr>
      )
    })
  }

  render() {
    const { Consumer, Provider } = this.newContext
    return (
      <Provider value={this.state.liveProps}>
        <Consumer>
          {this.props.children}
        </Consumer>
        <hr />
        <table style={{width: '100%'}}>
          <tbody>
            {this.inputRows}
          </tbody>
        </table>
      </Provider >
    )
  }
}
