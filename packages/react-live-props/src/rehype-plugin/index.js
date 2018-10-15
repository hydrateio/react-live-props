import visit from 'unist-util-visit'
import * as parser from '@babel/parser'
import traverse from '@babel/traverse'
import generate from '@babel/generator'
import types from '@babel/types'

export function rehypeReactLiveProps() {
  return transformer

  function transformer(tree) {
    visit(tree, 'jsx', visitor)
    return tree

    function visitor(node) {
      if (node.value.startsWith('<ReactLiveProps')) {
        const ast = parser.parse(node.value, {
          sourceType: 'script',
          plugins: ['jsx']
        })

        const visitors = {
          CallExpression(path) {
            /**
             * When the user is manually setting knobs, we need to finally instances where a knob
             * is defined and replace the prop with a value obtained via ReactContext.
             * In order for the values specified by the knobs, we attach them to the visitor
             * state and will append them as a prop to the ReactLiveProp component when we exit
             * that component.
             */
            let calleeName = ''
            if (types.isMemberExpression(path.node.callee)) {
              calleeName = path.node.callee.object.name
            }
            if (types.isIdentifier(path.node.callee)) {
              calleeName = path.node.callee.name
            }
            if (['text', 'boolean'].includes(calleeName)) {
              state.docProps.push({
                type: calleeName,
                key: `liveProp${state.docProps.length + 1}`,
                description: path.node.arguments[0].value,
                value: path.node.arguments[1].value
              })
              const sourceString = `liveProps.liveProp${state.docProps.length}.value`
              path.replaceWithSourceString(sourceString)
            }
          },
          JSXElement: {
            enter(path) {
              const openingElement = path.get('openingElement').node
              const attributes = openingElement.attributes
              const id = openingElement.name.name

              // Get values for props set my user in MDX file for component
              if (state.child && id === state.child.openingElement.name.name) {
                attributes.forEach(attr => {
                  const defaultPropValue = {
                    key: attr.name.name,
                    value: attr.value.value ? attr.value.value : attr.value.expression.value
                  }
                  state.autoDocProps.push(defaultPropValue)
                })
              }

              if (id === 'ReactLiveProps') {
                // Find first JSXElement child of ReactLiveProps component
                for (let child of path.node.children) {
                  if (child.type === 'JSXElement') {
                    state.child = child
                    break
                  }
                }
                // Check if auto-knobs are enabled
                attributes.forEach(attr => {
                  if (attr.name.name === 'knobType' && attr.value.value === 'auto') {
                    state.isAutoKnobEnabled = true
                  }
                })

                // Wrap all specified children of ReactLiveProps into React Context Consumer render method
                state.newChildren = types.jsxExpressionContainer(
                  types.arrowFunctionExpression(
                    [types.identifier('liveProps')],
                    types.blockStatement([
                      types.returnStatement(
                        types.parenthesizedExpression(
                          types.jsxElement(
                            types.jsxOpeningElement(types.jsxIdentifier('React.Fragment'), []),
                            types.jsxClosingElement(types.jsxIdentifier('React.Fragment')),
                            path.node.children
                          )
                        )
                      )
                    ])
                  )
                )
              }
            },
            exit(path) {
              const id = path.node.openingElement.name.name
              if (id === 'ReactLiveProps') {
                if (state.isAutoKnobEnabled) {
                  /**
                   * If knobtype is set to auto, props descriptions and types will come from docgen
                   * info supplied by the DocZ compile process. We need to send the user component to the
                   * ReactLiveProps component in order to look up those values.
                   */
                  path.node.openingElement.attributes.push(
                    types.jsxAttribute(
                      types.jsxIdentifier('component'),
                      types.jsxExpressionContainer(
                        types.identifier(state.child.openingElement.name.name)
                      )
                    )
                  )
                  /**
                   * In auto mode, we want to use an value specified by the user in the MDX file as the default
                   * value for the live prop. Here we query all props specified by the user and send them to the
                   * ReactLiveProp component as a prop
                   */
                  path.node.openingElement.attributes.push(
                    types.jsxAttribute(
                      types.jsxIdentifier('defaultValues'),
                      types.jsxExpressionContainer(
                        types.objectExpression(state.autoDocProps.map((prop) => {
                          const key = types.stringLiteral(prop.key)
                          let defaultValue
                          switch (typeof prop.value) {
                            case 'string':
                              defaultValue = types.stringLiteral(prop.value)
                              break
                            case 'boolean':
                              defaultValue = types.booleanLiteral(prop.value)
                              break
                            case 'number':
                              defaultValue = types.numericLiteral(prop.value)
                              break
                            default:
                              defaultValue = types.stringLiteral(String(prop.value))
                          }
                          return types.objectProperty(key, defaultValue)
                        }))
                      )
                    )
                  )
                  path.node.children = []
                } else {
                  /**
                   * If not using knobs, we need the user to define the properties of each knob.
                   * These properties were defined in the CallExpression visitor and attached to the
                   * ReactLiveProps component here as a prop
                   */
                  path.node.openingElement.attributes.push(
                    types.jsxAttribute(
                      types.jsxIdentifier('value'),
                      types.jsxExpressionContainer(
                        types.objectExpression(state.docProps.map((prop) => {
                          const key = types.stringLiteral(prop.key)
                          let defaultValue
                          switch (prop.type) {
                            case 'text':
                              defaultValue = types.stringLiteral(prop.value)
                              break
                            case 'boolean':
                              defaultValue = types.booleanLiteral(prop.value)
                              break
                            case 'number':
                              defaultValue = types.numberLiteral(prop.value)
                              break
                            default:
                              defaultValue = types.stringLiteral(String(prop.value))
                          }
                          const value = types.objectExpression([
                            types.objectProperty(types.stringLiteral('type'), types.stringLiteral(prop.type)),
                            types.objectProperty(types.stringLiteral('key'), key),
                            types.objectProperty(types.stringLiteral('defaultValue'), defaultValue),
                            types.objectProperty(types.stringLiteral('description'), types.stringLiteral(prop.description))
                          ])
                          return types.objectProperty(key, value)
                        }))
                      )
                    )
                  )
                  path.node.children = [state.newChildren]
                }
              }
            }
          }
        }

        const state = {
          child: null,
          docProps: [],
          autoDocProps: [],
          isAutoKnobEnabled: false,
          newChildren: null
        }

        traverse.default(ast, visitors, state)

        const newComponentSource = generate.default(ast).code
        // remove trailing semicolon added by babel generate
        node.value = newComponentSource.substr(0, newComponentSource.length - 1)
      }
    }
  }
}
