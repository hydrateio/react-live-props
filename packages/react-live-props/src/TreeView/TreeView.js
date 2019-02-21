import React from 'react'
import PropTypes from 'prop-types'
import cs from 'classnames'
import { getDisplayName } from '../Utils'
import { SchemaContext } from '../Context'

import './styles.css'

const RenderComponent = ({ component, values, componentDisplayName, editingComponent, onChangeComponent }) => {
  const displayName = getDisplayName(component)
  const isSelected = displayName === editingComponent
  return (
    <React.Fragment>
      <div>
        <a href='javascript:void(0)' className={isSelected ? 'rlp-tree-view-selected' : ''} onClick={() => onChangeComponent(displayName)}>{displayName}</a>
      </div>
      {values[componentDisplayName] && values[componentDisplayName].children && getDisplayName(values[componentDisplayName].children) && (
        <ul>
          <li>
            <RenderComponent editingComponent={editingComponent} component={values[componentDisplayName].children} values={values} componentDisplayName={getDisplayName(values[componentDisplayName].children)} onChangeComponent={onChangeComponent} />
          </li>
        </ul>
      )}
    </React.Fragment>
  )
}

class TreeView extends React.Component {
  static propTypes = {
    of: PropTypes.func.isRequired,
    className: PropTypes.string,
    availableTypes: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.func])),
    onChangeComponent: PropTypes.func.isRequired
  }

  render() {
    const { of, className, availableTypes, onChangeComponent, ...rest } = this.props

    return <SchemaContext.Consumer>
      {({ schema, values, rootComponentDisplayName, editingComponent }) => (
        <div className={cs('rlp-tree-view', className)} {...rest}>
          <ul>
            <li>
              <RenderComponent component={of} values={values} editingComponent={editingComponent} componentDisplayName={rootComponentDisplayName} onChangeComponent={onChangeComponent} />
            </li>
          </ul>
        </div>
      )}
    </SchemaContext.Consumer>
  }
}

export default TreeView
