import React from 'react'
import PropTypes from 'prop-types'
import { PropWrapper } from '../../Components'

const typeofToReactType = (jsType) => {
  if (jsType === 'boolean') return 'bool'

  if (jsType === 'undefined') return 'string'

  return jsType
}

class UnionFieldRenderer extends React.Component {
  static propTypes = {
    name: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.number.isRequired]),
    renderers: PropTypes.object,
    value: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
    type: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string
    })),
    property: PropTypes.object.isRequired,
    displayName: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.number.isRequired]),
    onDelete: PropTypes.func
  }

  state = {
    currentType: typeofToReactType(typeof value) || 'string'
  }
  render() {
    const { renderers, type, value, name, displayName, property, onDelete, ...rest } = this.props

    if (type.filter(allowedType => allowedType.name === 'node' || allowedType.name === 'element').length > 0) {
      const Renderer = renderers.node
      const valueOrDefault = Renderer.getValueWithDefault ? Renderer.getValueWithDefault(value) : value

      return <Renderer {...rest} name={name} displayName={displayName} property={property} type={type} value={valueOrDefault} />
    }

    return (
      <PropWrapper name={displayName} description={property.description} onDelete={onDelete}>
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
              <Renderer {...rest} name={name} displayName={''} property={property} type={type} value={valueOrDefault} key={Renderer.displayName} />
            )
          })}
        </div>
      </PropWrapper>
    )
  }
}

export default UnionFieldRenderer
