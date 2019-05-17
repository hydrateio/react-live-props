import React from 'react'
import PropTypes from 'prop-types'

export const RendererContext = React.createContext({})

const RendererResolver = ({ type, value, ...rest }) => {
  return (
    <RendererContext.Consumer>
      {({
        enum: EnumFieldRenderer,
        string: StringFieldRenderer,
        bool: BoolFieldRenderer,
        number: NumberFieldRenderer,
        shape: ShapeFieldRenderer,
        arrayOf: ArrayFieldRenderer,
        any: AnyFieldRenderer
      }) => {
        if (type.name === 'enum') {
          return <EnumFieldRenderer {...rest} value={value} />
        }

        if (type.name === 'any') {
          return <AnyFieldRenderer {...rest} value={value} />
        }

        if (type.name === 'string') {
          return <StringFieldRenderer {...rest} value={value} />
        }

        if (type.name === 'bool') {
          return <BoolFieldRenderer {...rest} value={value} />
        }

        if (type.name === 'number') {
          return <NumberFieldRenderer {...rest} value={value} />
        }

        if (type.name === 'shape') {
          const valueOrDefault = value || {}

          console.log('rendering shape', rest.name, value, valueOrDefault)

          return (
            <ShapeFieldRenderer
              {...rest}
              type={type.value}
              value={valueOrDefault}
            />
          )
        }

        if (type.name === 'arrayOf') {
          const valueOrDefault = value || []

          return (
            <ArrayFieldRenderer
              {...rest}
              value={valueOrDefault}
              type={type.value}
            />
          )
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
