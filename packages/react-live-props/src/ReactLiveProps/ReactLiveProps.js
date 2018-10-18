import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ComponentPreview from '../ComponentPreview'
import docgenToJsonSchema from 'react-docgen-to-json-schema'
import jsf from 'json-schema-faker'
import EditablePropsTable from '../EditablePropsTable'

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
    this.setInitialValues()
  }

  setInitialValues() {
    if (this.props['auto-generate'] === true) {
      this.getLivePropsForAutoKnobs()
    } else {
      this.getLivePropsForDefinedKnobs()
    }
  }

  getLivePropsForDefinedKnobs = () => {
    const values = this.props.value
    const liveProps = Object.keys(values).reduce((props, key) => {
      props[key] = {
        ...values[key],
        value: values[key].defaultValue,
        id: key
      }
      return props
    }, {})
    this.setState({ liveProps })
  }

  getLivePropsForAutoKnobs = () => {
    const defaults = this.props.defaultValues
    const docgenInfo = this.props.component.__docgenInfo
    const docgenDefaults = Object.keys(docgenInfo.props)
      .reduce((values, key) => {
        const prop = docgenInfo.props[key]
        values[key] = prop.defaultValue ? prop.defaultValue.value : null
        return values
      }, {})
    const schema = docgenToJsonSchema(docgenInfo)
    jsf.option({ alwaysFakeOptionals: true, useDefaultValue: true })
    const fakedValues = jsf(schema)
    const defaultValues = {
      ...docgenDefaults,
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
    this.setState({ liveProps })
  }

  onChange = ({ id, newValue }) => {
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

  get childComponent() {
    if (!this.props['auto-generate']) {
      return this.props.children
    }
    return (liveProps) => {
      const props = Object.keys(this.state.liveProps).reduce((props, key) => {
        props[key] = liveProps[key].value
        return props
      }, {})
      return <this.props.component {...props} />
    }
  }

  render() {
    if (this.state.liveProps === null) {
      return null
    }

    const { Consumer, Provider } = this.newContext
    return (
      <Provider value={this.state.liveProps}>
        <ComponentPreview
          component={<Consumer>{this.childComponent}</Consumer>}
          knobs={<EditablePropsTable liveProps={this.state.liveProps} onChange={this.onChange} />}
        />
      </Provider>
    )
  }
}
