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
        const docProps = []
        const ast = parser.parse(node.value, {
          sourceType: 'script',
          plugins: ['jsx']
        })

        const visitors = {
          CallExpression(path) {
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
              const id = path.node.openingElement.name.name
              if (id === 'ReactLiveProps') {
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

        const state = {
          docProps,
          newChildren: null
        }

        traverse.default(ast, visitors, state)

        const newComponentSource = generate.default(ast).code
        node.value = newComponentSource
      }
    }
  }
}
