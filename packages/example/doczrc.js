import { rehypeReactLiveProps } from '../react-live-props'

export default {
  indexHtml: './index.html',
  hashRouter: true,
  hastPlugins: [rehypeReactLiveProps],
  debug: true,
  modifyBundlerConfig: (config) => {
    config.module.rules.push({
      test: /\.js$/,
      use: ["source-map-loader"],
      enforce: "pre"
    })
    return config;
  }
}
