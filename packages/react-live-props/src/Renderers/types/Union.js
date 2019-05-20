import React from 'react'
import PropTypes from 'prop-types'

const typeofToReactType = (jsType) => {
  if (jsType === 'boolean') return 'bool'

  if (jsType === 'undefined') return 'string'

  return jsType
}

class UnionFieldRenderer extends React.Component {
  state = {
    currentType: typeofToReactType(typeof value) || 'string'
  }
  render() {
    const { renderers, type, value, ...rest } = this.props

    if (type.filter(allowedType => allowedType.name === 'node' || allowedType.name === 'element').length > 0) {
      const Renderer = renderers.node
      const valueOrDefault = Renderer.getValueWithDefault ? Renderer.getValueWithDefault(value) : value

      return <Renderer {...rest} type={type} value={valueOrDefault} />
    }

    const unionRenderers = type.map((allowedType) => renderers[allowedType.name])

    return (
      <div>
        <select value={this.state.currentType} onChange={(e) => {
          this.setState({
            currentType: e.target.value
          })
        }}>
          {type.map(allowedType => (
            <option value={allowedType.name} key={allowedType.name}>{allowedType.name}</option>
          ))}
        </select>
        {type.filter(allowedType => allowedType.name === this.state.currentType).map(allowedType => {
          const Renderer = renderers[allowedType.name]
          const valueOrDefault = Renderer.getValueWithDefault ? Renderer.getValueWithDefault(value) : value
          return (
            <Renderer {...rest} type={type} value={valueOrDefault} key={Renderer.displayName} />
          )
        })}
      </div>
    )
  }
}

UnionFieldRenderer.propTypes = {
  renderers: PropTypes.object,
  value: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  type: PropTypes.shape({
    name: PropTypes.string
  })
}

export default UnionFieldRenderer
