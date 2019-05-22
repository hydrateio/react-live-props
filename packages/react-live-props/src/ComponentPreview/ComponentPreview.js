import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { SchemaContext, TextContext, UIContext } from '../Context'

import cs from 'classnames'

export default class ComponentPreview extends Component {
  static propTypes = {
    className: PropTypes.string
  }

  state = {
    hasError: false
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.hasError) {
      return { hasError: false }
    }

    return prevState
  }

  componentDidCatch(error, info) {
    console.error(JSON.stringify(error), info)
    this.setState({
      hasError: true
    })
  }

  render() {
    const {
      className,
      ...rest
    } = this.props

    if (this.state.hasError) {
      return (
        <TextContext.Consumer>
          {(text) => (
            <p>{text.componentPreviewError}</p>
          )}
        </TextContext.Consumer>
      )
    }

    return (
      <UIContext.Consumer>
        {({ PreviewWrapper }) => (
          <SchemaContext.Consumer>
            {({ values }) => {
              return (
                <PreviewWrapper
                  className={cs(className)}
                  {...rest}
                >
                  {values}
                </PreviewWrapper>
              )
            }}
          </SchemaContext.Consumer>
        )}
      </UIContext.Consumer>

    )
  }
}
