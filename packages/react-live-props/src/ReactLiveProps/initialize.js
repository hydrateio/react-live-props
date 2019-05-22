import React from 'react'
import PropTypes from 'prop-types'
import { MdSave, MdAddCircle, MdDelete } from 'react-icons/md'
import { getDisplayName } from '../Utils'
import text from '../text'
import { TextContext } from '../Context'

const uiElements = {
  SaveButton: ({ onClick, className }) => <button type='button' className={className} onClick={onClick} aria-label='Save Item'>
    <MdSave />
  </button>,
  AddButton: ({ onClick, className }) => <button type='button' className={className} onClick={onClick} aria-label='Add Item'>
    <MdAddCircle />
  </button>,
  DeleteButton: ({ onClick, className }) => <button type='button' className={className} onClick={onClick} aria-label='Delete Item'>
    <MdDelete />
  </button>,
  ResetButton: ({ onClick, className }) => <TextContext.Consumer>
    {(text) => (
      <button type='button' className={className} onClick={onClick} aria-label='Reset Props'>
        {text.reset}
      </button>
    )}
  </TextContext.Consumer>,
  PreviewWrapper: ({ children, ...rest }) => <div {...rest}>{children}</div>
}

uiElements.SaveButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string
}

uiElements.AddButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string
}

uiElements.DeleteButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string
}

uiElements.ResetButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string
}

const DEFAULT_HTML_TYPES = ['p', 'a', 'em', 'span', 'strong', 'div', 'svg', 'path', 'ul', 'li', 'b', 'ol', 'blockquote', 'cite', 'pre', 'code', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'img', 'caption', 'table', 'tbody', 'thead', 'tr', 'td', 'th', 'tfoot', 'form']
const buildComponentTitle = (title, additionalTitleText) => {
  if (!additionalTitleText) return title

  return `${title} - ${additionalTitleText}`
}

export const initialize = ({
  of,
  docgenInfo,
  additionalTitleText,
  availableTypes,
  initialComponent,
  addButtonComponent = uiElements.AddButton,
  deleteButtonComponent = uiElements.DeleteButton,
  saveButtonComponent = uiElements.SaveButton,
  resetButtonComponent = uiElements.ResetButton,
  overrideText = {},
  componentPreviewWrapperComponent = uiElements.PreviewWrapper
}) => {
  const htmlTypes = [...DEFAULT_HTML_TYPES]
  const allDocGenInfo = []
  const info = docgenInfo || of.__docgenInfo
  if (!info) {
    throw new Error('ReactLiveProps must be given docgenInfo or a component annotated with __docgenInfo')
  }

  allDocGenInfo.push({
    props: {},
    ...info
  })

  allDocGenInfo.push(
    {
      description: 'React.Fragment',
      methods: [],
      props: {
        children: {
          description: '',
          required: false,
          type: {
            name: 'arrayOf',
            value: { name: 'node' }
          }
        }
      },
      displayName: getDisplayName('React.Fragment')
    }
  )

  const availableChildren = [{ name: 'React.Fragment' }, ...DEFAULT_HTML_TYPES]
  if (availableTypes) {
    availableTypes.forEach(child => {
      if (availableChildren.includes(child)) return

      availableChildren.push(child)
    })

    const typeInfo = DEFAULT_HTML_TYPES.concat(availableTypes).map(type => {
      if (typeof type === 'string') {
        if (!htmlTypes.includes(type)) {
          htmlTypes.push(type)
        }

        return {
          description: '',
          methods: [],
          props: {
            children: {
              description: '',
              required: false,
              type: {
                name: 'arrayOf',
                value: { name: 'node' }
              }
            }
          },
          displayName: type
        }
      }

      if (!type.__docgenInfo) {
        console.error('Docgen info missing for type', type)
      }

      return type.__docgenInfo
    })

    const filteredTypes = typeInfo.filter(type => type !== null).map(type => ({
      props: {},
      ...type
    }))
    if (filteredTypes.filter(type => typeof type === 'undefined').length > 0) {
      throw new Error('ReactLiveProps must be given docgenInfo or a component annotated with __docgenInfo')
    }
    allDocGenInfo.push(...filteredTypes)
  } else {
    const typeInfo = DEFAULT_HTML_TYPES.map(type => {
      if (typeof type === 'string') {
        if (!htmlTypes.includes(type)) {
          htmlTypes.push(type)
        }

        return {
          description: '',
          methods: [],
          props: {
            children: {
              description: '',
              required: false,
              type: {
                name: 'arrayOf',
                value: { name: 'node' }
              }
            }
          },
          displayName: type
        }
      }

      if (!type.__docgenInfo) {
        console.error('Docgen info missing for type', type)
      }

      return type.__docgenInfo
    })

    const filteredTypes = typeInfo.filter(type => type !== null).map(type => ({
      props: {},
      ...type
    }))
    if (filteredTypes.filter(type => typeof type === 'undefined').length > 0) {
      throw new Error('ReactLiveProps must be given docgenInfo or a component annotated with __docgenInfo')
    }
    allDocGenInfo.push(...filteredTypes)
  }

  try {
    const docgenInfo = {}
    allDocGenInfo.forEach(typeInfo => {
      try {
        docgenInfo[getDisplayName(typeInfo)] = typeInfo
      } catch (e) {
        console.error('Error parsing schema for type', typeInfo, e)
        throw new Error('Error parsing schema for type ', typeInfo.displayName)
      }
    })

    const safeDisplayName = getDisplayName(info)

    const values = initialComponent || React.createElement(of)

    const configuredUiElements = {
      AddButton: addButtonComponent,
      SaveButton: saveButtonComponent,
      DeleteButton: deleteButtonComponent,
      ResetButton: resetButtonComponent,
      PreviewWrapper: componentPreviewWrapperComponent
    }

    return {
      title: buildComponentTitle(safeDisplayName, additionalTitleText),
      values,
      rootComponentDisplayName: safeDisplayName,
      editingComponent: safeDisplayName,
      editingComponentPath: [],
      htmlTypes,
      availableTypes: availableChildren,
      docgenInfo,
      configuredUiElements,
      text: {
        ...text,
        ...overrideText
      }
    }
  } catch (err) {
    console.error('ReactLiveProps error initializing', err)
    return {
      errorMessage: err.message
    }
  }
}
