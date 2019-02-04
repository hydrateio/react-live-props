import React from 'react'
import ReactDOM from 'react-dom'

class ShadowRoot extends React.Component {
  constructor(props) {
    super(props)

    this.root = null
    this.state = {}
  }

  componentDidMount() {
    const mode = this.props.mode || 'closed'
    this.setState({
      shadowRoot: this.root.attachShadow({ mode })
    }, () => {
      ReactDOM.render(this.props.children, this.state.shadowRoot)
    })
  }

  render() {
    const { children, loader, ...rest } = this.props

    if (!this.state.shadowRoot) {
      return <div ref={root => (this.root = root)} {...rest}>Loading...</div>
    }

    return (
      <div {...rest} ref={root => (this.root = root)} />
    )
  }
}

export default ShadowRoot
