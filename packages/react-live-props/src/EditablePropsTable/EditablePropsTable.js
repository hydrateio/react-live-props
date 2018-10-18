import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Input from '../Input'

class EditablePropsTable extends Component {
  static propTypes = {
    liveProps: PropTypes.object.isRequired
  }

  static Table = styled.table`
    width: 100%;
    border: 1px solid #AAA;
  `
  static Row = styled.tr`
    height: 24px;
    line-height: 24px;
    font-size: 18px;
    border-bottom: 1px solid #CCC;
    &:last-child {
      border-bottom: none;
    }
  `
  static Cell = styled.td`
    padding: 4px;
  `

  render() {
    return (
      <EditablePropsTable.Table>
        <tbody>
          {Object.keys(this.props.liveProps).map(propKey => {
            const liveProp = this.props.liveProps[propKey]
            const props = {
              type: liveProp.type,
              liveProp,
              onChange: this.props.onChange
            }
            return (
              <EditablePropsTable.Row key={propKey} >
                <EditablePropsTable.Cell>
                  <label htmlFor={liveProp.id}>{liveProp.description}</label>
                </EditablePropsTable.Cell>
                <EditablePropsTable.Cell >
                  <Input {...props} />
                </EditablePropsTable.Cell>
              </EditablePropsTable.Row>
            )
          })}

        </tbody>
      </EditablePropsTable.Table>
    )
  }
}

export default EditablePropsTable
