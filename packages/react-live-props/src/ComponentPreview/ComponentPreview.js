import React, { PureComponent } from 'react'
import { renderToString } from 'react-dom/server'
import PropTypes from 'prop-types'
import Resizable from 're-resizable'
import { Smartphone, Tablet, Monitor, Maximize, Minimize } from 'react-feather'
import styled from 'styled-components'

const Container = styled.div`
  z-index: ${props => props.fullscreen ? 1000 : 0};
  position: ${props => props.fullscreen ? 'fixed' : 'relative'};
  top: 0px;
  left: 0px;
  min-width: ${props => props.fullscreen ? '100vw' : undefined};
  min-height: ${props => props.fullscreen ? '100vh' : undefined};
  background-color: rgba(0, 0, 0, ${props => props.fullscreen ? 0.8 : 0});
  overflow: auto;
`

const GridContainer = styled.div`
  display: grid;
  grid-gap: 4px;
  height: ${props => props.fullscreen ? '100vh' : undefined};
  width: ${props => props.fullscreen ? '100vw' : undefined};
  ${props => {
    return props.fullscreen
      ? `grid-template-columns: 1fr ${props.previewWidth}px 1fr;
        grid-template-rows: 1fr ${props.previewHeight}px 1fr;
        grid-template-areas:
          ". controls ."
          ". preview ."
          "knobs knobs knobs"
          ". . ."`
      : `grid-template-columns: auto;
        grid-template-rows: auto auto auto;
        grid-template-areas:
          "controls"
          "preview"
          "knobs"`
  }}
`

const Preview = styled.div`
  grid-area: preview;
  width: 100%;
  height: 100%;
  background-color: white;
  position: relative;
  padding: 0px 1px 1px 0px;
`
const Controls = styled.div`
  grid-area: controls;
  background-color: gray;
  align-self: end;
  justify-self: stretch;
  height: 32px;
  padding: 4px;
`
const ControlIcon = styled.div`
  float: right;
  cursor: pointer;
`

const Knobs = styled.div`
  grid-area: knobs;
  align-self: stretch;
  background-color: white;
`

const deviceSizes = {
  mobile: { width: 360, height: 640 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1366, height: 1024 }
}

export default class DevicePreview extends PureComponent {
  static propTypes = {
    component: PropTypes.node,
    knobs: PropTypes.node
  }

  iframeRef = React.createRef()
  gridContainerRef = React.createRef()
  shadowComponent = React.createRef()

  state = {
    fullscreen: false,
    initialContainerWidth: '100%',
    previewCssText: '',
    previewWidth: '100%',
    previewHeight: deviceSizes.mobile.height,
    resizableWidth: deviceSizes.mobile.width,
    resizableHeight: deviceSizes.mobile.height
  }

  componentDidMount() {
    const styleRules = getStyles(this.shadowComponent.current)
    this.setState({
      previewCssText: `body { padding: 0px; margin: 0px } ${styleRules.join(' ')}`,
      previewWidth: this.gridContainerRef.current.offsetWidth,
      initialContainerWidth: this.gridContainerRef.current.offsetWidth
    })
  }

  componentDidUpdate(prevProps) {
    const style = document.createElement('style')
    style.textContent = this.state.previewCssText
    const inlineHtml = this.shadowComponent.current.childNodes[0].outerHTML
    this.iframeRef.current.contentDocument.open()
    this.iframeRef.current.contentDocument.write(inlineHtml)
    this.iframeRef.current.contentDocument.head.appendChild(style)
  }

  onResize = (e, dir, ref, delta) => {
    if (dir === 'right') {
      this.setState({
        previewWidth: this.state.resizableWidth + (delta.width * 2)
      })
    } else if (dir === 'bottom') {
      this.setState({
        previewHeight: this.state.resizableHeight + (delta.height * 2)
      })
    }
  }

  onResizeStop = () => {
    this.setState({
      resizableHeight: this.state.previewHeight,
      resizableWidth: this.state.previewWidth
    })
  }

  setSize = (device) => {
    this.setState({
      previewHeight: deviceSizes[device].height,
      previewWidth: deviceSizes[device].width,
      resizableHeight: deviceSizes[device].height,
      resizableWidth: deviceSizes[device].width
    })
  }

  toggleFullscreen = () => {
    const fs = !this.state.fullscreen
    this.setState({
      previewHeight: deviceSizes.mobile.height,
      previewWidth: this.state.initialContainerWidth,
      resizableHeight: fs ? deviceSizes.mobile.height : '100%',
      resizableWidth: fs ? deviceSizes.mobile.width : '100%',
      fullscreen: fs
    })
  }

  get controls() {
    if (this.state.fullscreen) {
      return (
        <Controls>
          <ControlIcon title='Exit Fullscreen Preview'>
            <Minimize width={24} onClick={this.toggleFullscreen} />
          </ControlIcon>
          <ControlIcon title='Desktop Preview'>
            <Monitor width={24} onClick={() => this.setSize('desktop')} />
          </ControlIcon>
          <ControlIcon title='Table Preview'>
            <Tablet width={24} onClick={() => this.setSize('tablet')} />
          </ControlIcon>
          <ControlIcon title='Mobile Preview'>
            <Smartphone width={24} onClick={() => this.setSize('mobile')} />
          </ControlIcon>
        </Controls>
      )
    }
    return (
      <Controls>
        <ControlIcon title='Enter Fullscreen Preview'>
          <Maximize width={24} onClick={this.toggleFullscreen} />
        </ControlIcon>
      </Controls>
    )
  }

  render() {
    const {
      fullscreen,
      previewHeight,
      previewWidth,
      resizableHeight,
      resizableWidth
    } = this.state
    return (
      <Container fullscreen={fullscreen}>
        <div ref={this.shadowComponent} style={{ height: '0px', width: '0px', visibility: 'hidden' }}>
          {this.props.component}
        </div>
        <GridContainer
          previewHeight={previewHeight}
          previewWidth={previewWidth}
          fullscreen={fullscreen}
          ref={this.gridContainerRef}
        >
          {this.controls}
          <Preview>
            <Resizable
              size={{
                width: resizableWidth,
                height: resizableHeight
              }}
              enable={{ right: fullscreen, bottom: fullscreen }}
              onResize={this.onResize}
              onResizeStop={this.onResizeStop}
              bounds='window'
              className='resizeable'
            >
              <iframe frameBorder='0' ref={this.iframeRef} style={{ width: previewWidth, height: previewHeight }} />
            </Resizable>
          </Preview>
          <Knobs>{this.props.knobs}</Knobs>
        </GridContainer>
      </Container>
    )
  }
}

function getStyles(ele) {
  let ret = []
  if (ele instanceof Element) {
    ret = ret.concat(getCssRules(ele))
    if (ele.childNodes) {
      ele.childNodes.forEach(n => {
        ret = ret.concat(getStyles(n))
      })
    }
  }
  return ret
}

function getCssRules(el) {
  const sheets = document.styleSheets
  const ret = []
  el.matches = el.matches ||
    el.webkitMatchesSelector ||
    el.mozMatchesSelector ||
    el.msMatchesSelector ||
    el.oMatchesSelector

  for (let i in sheets) {
    let rules
    try {
      rules = sheets[i].rules || sheets[i].cssRules
    } catch (e) {
      continue
    }
    for (let r in rules) {
      if (el.matches(rules[r].selectorText)) {
        ret.push(rules[r].cssText)
      }
      if (rules[r].type === 4) {
        // media query rules
        for (let mqr in rules[r].cssRules) {
          if (el.matches(rules[r].cssRules[mqr].selectorText)) {
            ret.push(rules[r].cssText)
          }
        }
      }
    }
  }
  return ret
}
