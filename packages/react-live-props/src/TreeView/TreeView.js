import React from 'react'
import PropTypes from 'prop-types'
import cs from 'classnames'
import { findNodeProperties, convertSafeDisplayNameToRaw, getDisplayName } from '../Utils'
import { SchemaContext } from '../Context'

import styles from './styles.css'

const RenderComponent = ({ values, componentDisplayName, onChangeComponent, componentPath }) => {
  return (
    <SchemaContext.Consumer>
      {({ htmlTypes, docgenInfo, editingComponentPath }) => {
        const isSelected = editingComponentPath === componentPath
        return (
          <React.Fragment>
            <li>
              <p><a href='javascript:void(0)' className={isSelected ? cs('rlpTreeViewSelected', styles.rlpTreeViewSelected) : ''} onClick={() => onChangeComponent(componentDisplayName, componentPath)}>{convertSafeDisplayNameToRaw(componentDisplayName)}</a></p>
            </li>
            {findNodeProperties(componentDisplayName, docgenInfo[componentDisplayName], htmlTypes).map((nodeProp, nodeIdx) => {
              if (values && values[nodeProp]) {
                if (Array.isArray(values[nodeProp]) && values[nodeProp].length === 0) return null

                if (Object.keys(values[nodeProp]).length === 0) return null
              } else {
                return null
              }

              return (
                <li className={cs('rlpTreeViewListContainer', styles.rlpTreeViewListContainer)} key={`${componentDisplayName}.${nodeProp}.${nodeIdx}`}>
                  <div className={cs('rlpTreeViewPropContainer', styles.rlpTreeViewPropContainer)}>
                    <p>{nodeProp}</p>
                    <ul>
                      {Array.isArray(values[nodeProp]) && values[nodeProp].map((child, idx) => {
                        const newPath = `${componentPath}.${nodeProp}.${idx}.${child.type}`
                        return (
                          <RenderComponent key={`${child.type}-${idx}`} componentPath={newPath} values={values[nodeProp][idx][child.type]} componentDisplayName={getDisplayName(child.type)} onChangeComponent={onChangeComponent} />
                        )
                      })}
                      {!Array.isArray(values[nodeProp]) && (
                        <RenderComponent componentPath={`${componentPath}.${nodeProp}.${values[nodeProp].type}`} values={values[nodeProp][values[nodeProp].type]} componentDisplayName={getDisplayName(values[nodeProp].type)} onChangeComponent={onChangeComponent} />
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
  values: PropTypes.object.isRequired,
  componentDisplayName: PropTypes.string.isRequired,
  onChangeComponent: PropTypes.func.isRequired,
  componentPath: PropTypes.string.isRequired
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
      {({ values, rootComponentDisplayName }) => {
        return (
          <div className={cs('rlpTreeView', styles.rlpTreeView, className)} {...rest}>
            <ul>
              <RenderComponent values={values[rootComponentDisplayName]} componentPath={rootComponentDisplayName} componentDisplayName={rootComponentDisplayName} onChangeComponent={onChangeComponent} />
            </ul>
          </div>
        )
      }}
    </SchemaContext.Consumer>
  }
}

export default TreeView
