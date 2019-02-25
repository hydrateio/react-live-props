import React from 'react'
import PropTypes from 'prop-types'
import cs from 'classnames'
import { hasChildren } from '../Utils'
import { SchemaContext } from '../Context'

import './styles.css'

const RenderComponent = ({ values, componentDisplayName, editingComponent, editingComponentPath, onChangeComponent, componentPath }) => {
  const isSelected = editingComponentPath === componentPath

  return (
    <React.Fragment>
      <li>
        <p><a href='javascript:void(0)' className={isSelected ? 'rlp-tree-view-selected' : ''} onClick={() => onChangeComponent(componentDisplayName, componentPath)}>{componentDisplayName}</a></p>
      </li>
      {hasChildren(values) && (
        <li className='rlp-tree-view-list-container'>
          <ul>
            {values && values.children && Array.isArray(values.children) && values.children.map((child, idx) => {
              const newPath = `${componentPath}.children.${idx}.${child.type}`
              return (
                <RenderComponent key={`${child.type}-${idx}`} editingComponent={editingComponent} editingComponentPath={editingComponentPath} componentPath={newPath} values={values.children[idx][child.type]} componentDisplayName={child.type} onChangeComponent={onChangeComponent} />
              )
            })}
            {values && values.children && !Array.isArray(values.children) && (
              <RenderComponent editingComponent={editingComponent} editingComponentPath={editingComponentPath} componentPath={`${componentPath}.children.${values.children.type}`} values={values.children[values.children.type]} componentDisplayName={values.children.type} onChangeComponent={onChangeComponent} />
            )}
          </ul>
        </li>
      )}
    </React.Fragment>
  )
}

RenderComponent.propTypes = {
  values: PropTypes.object.isRequired,
  componentDisplayName: PropTypes.string.isRequired,
  editingComponent: PropTypes.string.isRequired,
  editingComponentPath: PropTypes.string.isRequired,
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
      {({ values, rootComponentDisplayName, editingComponent, editingComponentPath }) => {
        return (
          <div className={cs('rlp-tree-view', className)} {...rest}>
            <ul>
              <RenderComponent values={values[rootComponentDisplayName]} editingComponentPath={editingComponentPath} componentPath={rootComponentDisplayName} editingComponent={editingComponent} componentDisplayName={rootComponentDisplayName} onChangeComponent={onChangeComponent} />
            </ul>
          </div>
        )
      }}
    </SchemaContext.Consumer>
  }
}

export default TreeView
