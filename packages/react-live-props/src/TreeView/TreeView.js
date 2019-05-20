import React from 'react'
import PropTypes from 'prop-types'
import cs from 'classnames'
import { findComponentProperties, getDisplayName } from '../Utils'
import { SchemaContext } from '../Context'

import styles from './styles.css'

const arePathsEquivalent = (a, b) => {
  if (a.length !== b.length) return false

  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false
  }

  return true
}

const RenderComponent = ({ values, componentDisplayName, onChangeComponent, componentPath }) => {
  return (
    <SchemaContext.Consumer>
      {({ docgenInfo, editingComponentPath }) => {
        const isSelected = arePathsEquivalent(editingComponentPath, componentPath)
        return (
          <React.Fragment>
            <li>
              <p><a href='javascript:void(0)' className={isSelected ? cs('rlpTreeViewSelected', styles.rlpTreeViewSelected) : ''} onClick={() => onChangeComponent(componentDisplayName, componentPath)}>{componentDisplayName}</a></p>
            </li>
            {typeof values !== 'string' && docgenInfo[componentDisplayName] && findComponentProperties(docgenInfo[componentDisplayName].props).map((nodeProp, nodeIdx) => {
              if (values && values.props[nodeProp]) {
                if (typeof values.props[nodeProp] === 'string') return null

                if (Array.isArray(values.props[nodeProp]) && values.props[nodeProp].length === 0) return null

                if (Object.keys(values.props[nodeProp]).length === 0) return null
              } else {
                return null
              }

              return (
                <li className={cs('rlpTreeViewListContainer', styles.rlpTreeViewListContainer)} key={`${componentDisplayName}.${nodeProp}.${nodeIdx}`}>
                  <div className={cs('rlpTreeViewPropContainer', styles.rlpTreeViewPropContainer)}>
                    <p>{nodeProp}</p>
                    <ul>
                      {Array.isArray(values.props[nodeProp]) && values.props[nodeProp].map((child, idx) => {
                        const newPath = [...componentPath, 'props', nodeProp, idx]
                        return (
                          <RenderComponent key={`${child.type}-${idx}`} componentPath={newPath} values={values.props[nodeProp][idx]} componentDisplayName={getDisplayName(child)} onChangeComponent={onChangeComponent} />
                        )
                      })}
                      {!Array.isArray(values.props[nodeProp]) && values.props[nodeProp] && (
                        <RenderComponent componentPath={[...componentPath, 'props', nodeProp]} values={values.props[nodeProp]} componentDisplayName={getDisplayName(values.props[nodeProp])} onChangeComponent={onChangeComponent} />
                      )}
                    </ul>
                  </div>
                </li>
              )
            })}
          </React.Fragment>
        )
      }}
    </SchemaContext.Consumer>
  )
}

RenderComponent.propTypes = {
  values: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
  componentDisplayName: PropTypes.string.isRequired,
  onChangeComponent: PropTypes.func.isRequired,
  componentPath: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])).isRequired
}

class TreeView extends React.Component {
  static propTypes = {
    of: PropTypes.func.isRequired,
    className: PropTypes.string,
    onChangeComponent: PropTypes.func.isRequired
  }

  render() {
    const { of, className, onChangeComponent, ...rest } = this.props

    return <SchemaContext.Consumer>
      {({ values, rootComponentDisplayName, docgenInfo }) => {
        return (
          <div className={cs('rlpTreeView', styles.rlpTreeView, className)} {...rest}>
            <ul>
              <RenderComponent values={values} componentPath={[]} componentDisplayName={rootComponentDisplayName} onChangeComponent={onChangeComponent} />
            </ul>
          </div>
        )
      }}
    </SchemaContext.Consumer>
  }
}

export default TreeView
