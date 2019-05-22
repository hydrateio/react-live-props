import React from 'react'
import PropTypes from 'prop-types'
import { PropWrapper } from '../Components'

export const RendererContext = React.createContext({})

const RendererResolver = ({ type, value, ...rest }) => {
  return (
    <RendererContext.Consumer>
      {(renderers) => {
        if (type.name === 'union') {
          const Renderer = renderers[type.name]
          const valueOrDefault = Renderer.getValueWithDefault ? Renderer.getValueWithDefault(value) : value

          return <Renderer renderers={renderers} {...rest} type={type.value} value={valueOrDefault} />
        }

        if (renderers[type.name]) {
          const Renderer = renderers[type.name]
          const valueOrDefault = Renderer.getValueWithDefault ? Renderer.getValueWithDefault(value) : value

          return <Renderer {...rest} type={type.value} value={valueOrDefault} />
        }

        console.log('UNSUPPORTED', type)
        return (
          <PropWrapper name={rest.name} description={rest.property.description}>
            PROP TYPE NOT SUPPORTED: {type.value && type.value.name ? `${type.name} (${type.value.name})` : type.name}
          </PropWrapper>
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
