const webpack = require('webpack')
const path = require('path')

const plugins = env => env === 'develop' ? [
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin()
    ] : []

const entry = env => env === 'develop' ? [
      'webpack/hot/dev-server',
      'webpack-hot-middleware/client',
      './index.js'
    ] : ['./index.js']

const loaders = env => env === 'develop' ? [
      'babel-loader',
      'eslint-loader'
    ] : ['babel-loader']

module.exports = env => {
  return {
    context: path.join(__dirname, 'app'),
    entry: entry(env),
    output: {
      path: path.join(process.cwd(), 'dist'),
      publicPath: '/',
      filename: 'app.js'
    },
    module: {
      loaders: [
        {
          test: /\.js$/,
          loaders: loaders(env),
          include: __dirname,
          exclude: /node_modules/
        }
      ]
    },
    plugins: plugins(env)
  }
}
