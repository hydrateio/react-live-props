import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { SchemaContext } from '../Context'
import reactElementToJSXString from 'react-element-to-jsx-string'

import cs from 'classnames'

import styles from './styles.css'

/* global Prism */

export default class ComponentMarkup extends Component {
  static propTypes = {
    className: PropTypes.string
  }

  componentDidMount() {
    // we don't include prism, but consumers can provide prism.js and prism.css and this will apply
    if (!Prism) return

    this.node.querySelectorAll('code').forEach((block) => {
      Prism.highlightElement(block)
    })
  }

  componentDidUpdate() {
    if (!Prism) return

    this.node.querySelectorAll('code').forEach((block) => {
      Prism.highlightElement(block)
    })
  }

  render() {
    const {
      className,
      ...rest
    } = this.props

    return (
      <SchemaContext.Consumer>
        {({ values }) => {
          return (
            <div
              ref={ref => {
                this.node = ref
              }}
              className={cs('codeRoot', styles.codeRoot, className)}
              {...rest}
            >
              <pre>
                <code className='language-jsx'>{reactElementToJSXString(values)}</code>
              </pre>
            </div>
          )
        }}

      </SchemaContext.Consumer>
    )
  }
}
