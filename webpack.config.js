const webpack = require('webpack')

module.exports = {
    entry: {
        app: './app',
        vendor: ['ramda', '@cycle/dom'],
    },
    output: {
        basePath: 'dist/',
        filename: '[name].js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loaders: ['babel-loader'],
                include: __dirname,
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js'),
    ]
}
