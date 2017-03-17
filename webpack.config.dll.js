const webpack = require('webpack')
const path = require('path')

const outputPath = path.join(process.cwd(), 'dist')

module.exports = entries => {
  return {
    context: process.cwd(),
    entry: entries,
    output: {
      filename: 'vendor.dll.js',
      path: outputPath,
      library: 'vendor',
    },
    plugins: [
      new webpack.DllPlugin({
        name: 'vendor',
        path: path.join(outputPath, 'vendor.json')
      })
    ]
  }
}
