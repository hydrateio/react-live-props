# react-live-props

> Live playground for interacting with props on React components.

[![NPM](https://img.shields.io/npm/v/react-live-props.svg)](https://www.npmjs.com/package/react-live-props) [![Build Status](https://travis-ci.com/hydrateio/react-live-props.svg?branch=master)](https://travis-ci.com/hydrateio/react-live-props) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-live-props
```

## Usage

```jsx
import React, { Component } from 'react'

import { ReactLiveProps } from 'react-live-props'
import MyExampleComponent from './my-example-component'

class Example extends Component {
  render () {
    return (
      <ReactLiveProps>
        <MyExampleComponent />
      </ReactLiveProps>
    )
  }
}
```

## Developing
Most easily done with two terminal windows

In first window
```bash
cd packages/react-live-props
yarn start
```

In second window
```bash
cd packages/example
yarn start
```

open browser to https://localhost:3000

## License

MIT © [Hydrate](https://hydrate.io)
