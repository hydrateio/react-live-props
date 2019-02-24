export default {
  wrapper: undefined,
  indexHtml: './index.html',
  title: 'React Live Props Example',
  theme: 'docz-theme-default',
  modifyBundlerConfig: (config) => {
    config.resolve.extensions.push('.css')
    config.module.rules.push({
      test: /\.css$/,
      use: ["style-loader", "css-loader"]
    })

    return config
  }
}
