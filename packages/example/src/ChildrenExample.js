import React, { Component } from 'react'
import PropTypes from 'prop-types'

export const Panel = ({ children, bold = false }) => (
  <div style={{ fontWeight: bold ? 'bold' : 'normal' }}>
    <div>Panel</div>
    {children}
  </div>
)

Panel.propTypes = {
  children: PropTypes.node,
  bold: PropTypes.bool
}

export const Text = ({ text }) => (
  <p>Text: {text}</p>
)

Text.propTypes = {
  text: PropTypes.string.isRequired,
}

const ComponentUnderTest = ({ children, color }) => (
  <div style={{ color }}>
    {children}
  </div>
)

ComponentUnderTest.propTypes = {
  color: PropTypes.string.isRequired,
  children: PropTypes.node
}

export default ComponentUnderTest
