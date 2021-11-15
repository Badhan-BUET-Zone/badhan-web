module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  configureWebpack: {
    module: {
      rules: [{
        test: /\.md$/,
        loader: 'raw-loader' // npm install -D raw-loader
      }]
    }
  }
}
