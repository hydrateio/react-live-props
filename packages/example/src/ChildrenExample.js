import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './prism.js'
import './prism.css'

export const Panel = ({ children, bold = false }) => (
  <div style={{ fontWeight: bold ? 'bold' : 'normal', marginLeft: '8px', borderLeft: '1px solid black' }}>
    <div>Panel</div>
    {children}
  </div>
)

export const Other = () => (
  <div>Other</div>
)

Other.displayName = 'Panel.Other'
Other.propTypes = {}

Panel.Other = Other

Panel.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node),
  bold: PropTypes.bool
}

export const Text = ({ text }) => (
  <p>Text: {text}</p>
)

Text.propTypes = {
  text: PropTypes.string.isRequired,
}

const ComponentUnderTest = ({ children, color, header }) => {
  if (header) {
    return (
      <div style={{ color }}>
        {header}
        {children}
      </div>
    )
  }

  return (
    <div style={{ color }}>
      {children}
    </div>
  )
}

ComponentUnderTest.propTypes = {
  color: PropTypes.string.isRequired,
  children: PropTypes.node,
  header: PropTypes.node
}

export default ComponentUnderTest
