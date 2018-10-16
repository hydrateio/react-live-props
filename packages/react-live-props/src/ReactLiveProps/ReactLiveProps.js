import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Input from '../Input'
import ComponentPreview from '../ComponentPreview'
import docgenToJsonSchema from 'react-docgen-to-json-schema'
import jsf from 'json-schema-faker'

export class ReactLiveProps extends Component {
  static propTypes = {
    children: PropTypes.func,
    'auto-generate': PropTypes.bool,
    value: PropTypes.object,
    defaultValues: PropTypes.object,
    component: PropTypes.func
  }

  newContext = React.createContext()
  state = {
    liveProps: null
  }

  componentDidMount() {
    this._setInitialValues()
  }

  async _setInitialValues() {
    let liveProps
    if (this.props['auto-generate'] === true) {
      liveProps = await getLivePropsForAutoKnobs(this.props.defaultValues, this.props.component.__docgenInfo)
    } else {
      liveProps = getLivePropsForDefinedKnobs(this.props.value)
    }

    this.setState({
      liveProps
    })
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
      const props = {
        type: liveProp.type,
        liveProp,
        onChange: this._onChange
      }
      try {
        PropTypes.checkPropTypes(Input.propTypes, props, 'prop', 'Input')
      } catch (e) {
        return null
      }
      return (
        <tr key={propKey} >
          <td>
            <label htmlFor={liveProp.id}>{liveProp.description}</label>
          </td>
          <td >
            <Input {...props} />
          </td>
        </tr>
      )
    })
  }

  get childComponent() {
    if (!this.props['auto-generate']) {
      return this.props.children
    }
    return (liveProps) => <this.props.component {...Object.keys(this.state.liveProps).reduce((props, key) => {
      props[key] = liveProps[key].value
      return props
    }, {})} />
  }

  render() {
    if (this.state.liveProps === null) {
      return null
    }

    const { Consumer, Provider } = this.newContext
    return (
      <Provider value={this.state.liveProps}>
        <ComponentPreview>
          <Consumer>
            {this.childComponent}
          </Consumer>
        </ComponentPreview>
        <hr />
        <table style={{ width: '100%' }}>
          <tbody>
            {this.inputRows}
          </tbody>
        </table>
      </Provider>
    )
  }
}

function getLivePropsForDefinedKnobs(values) {
  return Object.keys(values).reduce((props, key) => {
    props[key] = {
      ...values[key],
      value: values[key].defaultValue,
      id: key
    }
    return props
  }, {})
}

async function getLivePropsForAutoKnobs(defaults, docgenInfo) {
  try {
    const schema = docgenToJsonSchema(docgenInfo)
    jsf.option({ alwaysFakeOptionals: true, useDefaultValue: true })
    const fakedValues = await jsf.resolve(schema)
    const defaultValues = {
      ...fakedValues,
      ...defaults
    }
    const liveProps = Object.keys(defaultValues).reduce((values, key) => {
      values[key] = {
        id: key,
        description: docgenInfo.props[key] ? docgenInfo.props[key].description : `No prop description provided for ${key}`,
        type: docgenInfo.props[key] ? docgenInfo.props[key].type.name : typeof defaultValues[key],
        value: defaultValues[key] !== undefined ? defaultValues[key] : ''
      }
      return values
    }, {})
    return liveProps
  } catch (err) {
    console.error('ReactLiveProps error resolving JSON Schema', err)
    throw err
  }
}
