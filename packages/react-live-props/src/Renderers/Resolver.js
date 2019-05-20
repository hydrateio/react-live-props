import React from 'react'
import PropTypes from 'prop-types'

export const RendererContext = React.createContext({})

const RendererResolver = ({ type, value, ...rest }) => {
  return (
    <RendererContext.Consumer>
      {(renderers) => {
        if (renderers[type.name]) {
          const Renderer = renderers[type.name]
          const valueOrDefault = Renderer.getValueWithDefault ? Renderer.getValueWithDefault(value) : value

          return <Renderer {...rest} type={type.value} value={valueOrDefault} />
        }

        console.log('UNSUPPORTED', type)
        return (
          <div>
            PROP TYPE NOT SUPPORTED: {type.value && type.value.name ? `${type.name} (${type.value.name})` : type.name}
          </div>
        )
      }}
    </RendererContext.Consumer>
  )
}

RendererResolver.propTypes = {
  type: PropTypes.shape({
    name: PropTypes.string
  }),
  value: PropTypes.any
}

export default RendererResolver
