const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  publicPath: './',
  configureWebpack: config => {
    config.plugins.forEach((val) => {
      if (val instanceof HtmlWebpackPlugin) {
        val.options.title = "榕悦花园预选房系统"
      }
    }) 
  }
}