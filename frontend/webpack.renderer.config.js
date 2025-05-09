const path = require('path');
const webpack = require('webpack'); // Добавили Webpack

module.exports = {
  mode: 'development',
  target: 'electron-renderer',
  entry: './src/renderer.js',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', {
                targets: {
                  electron: '10.0.0'
                }
              }]
            ]
          }
        },
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    })
  ],
};