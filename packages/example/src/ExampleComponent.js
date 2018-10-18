import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'

const sizes = {
  desktop: 992,
  tablet: 768,
  phone: 360,
}
const media = Object.keys(sizes).reduce((acc, label) => {
  acc[label] = (...args) => css`
    @media screen and (max-width: ${sizes[label]}px) {
      ${css(...args)}
    }
  `
  return acc
}, {})
const StyleContainer = styled.div`
  display: grid;
  width: 100%;
  height: 100%;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: auto auto auto;
  grid-template-areas: "foo bar baz" "ub jc jc" "children children children";

  ${media.desktop`
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: auto auto auto;
    grid-template-areas: "foo bar baz" "ub jc jc" "children children children";
  `}
  ${media.tablet`
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr auto auto;
    grid-template-areas: "foo baz" "bar bar" "ub ub" "jc jc" "children children";
  `}
  ${media.phone`
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr 1fr 1fr 1fr 1fr;
    grid-template-areas: "foo" "bar" "baz" "ub" "jc" "children";
  `}
`

const GridItem = styled.div`
  grid-area: ${props => props.gridArea};
  background-color: ${props => props.backgroundColor};
  word-break: break-word;
`

export default class ExampleComponent extends Component {
  static propTypes = {
    /**
     * Description foo.
     */
    foo: PropTypes.number,

    /**
     * Description bar.
     *
     * - markdown list-item 1
     * - markdown list-item 2
     */
    bar: PropTypes.string.isRequired,

    /**
     * Description baz.
     */
    baz: PropTypes.bool,

    /**
     * uncontrolled boolean.
     */
    uncontrolledBoolean: PropTypes.bool,

    /**
     * List of JSX elements
     */
    jsxControls: PropTypes.arrayOf(PropTypes.node)
  }

  static defaultProps = {
    bar: 'bar'
  }

  render() {
    const {
      foo,
      bar,
      baz,
      uncontrolledBoolean
    } = this.props

    return (
      <StyleContainer>
        <GridItem gridArea='foo' backgroundColor='red'>
          foo: {JSON.stringify(foo, null, 2)}
        </GridItem>

        <GridItem gridArea='bar' backgroundColor='blue'>
          bar: {JSON.stringify(bar, null, 2)}
        </GridItem>

        <GridItem gridArea='baz' backgroundColor='green'>
          baz: {JSON.stringify(baz, null, 2)}
        </GridItem>

        <GridItem gridArea='ub' backgroundColor='yellow'>
          uncontrolledBoolean: {JSON.stringify(uncontrolledBoolean, null, 2)}
        </GridItem>

        <GridItem gridArea='jc' backgroundColor='magenta'>
          {this.props.jsxControls ? this.props.jsxControls : null}
        </GridItem>

        <GridItem gridArea='children' backgroundColor='orange'>
          {this.props.children}
        </GridItem>
      </StyleContainer>
    )
  }
}
