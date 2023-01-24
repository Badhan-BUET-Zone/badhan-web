const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  devServer: {
    client: {
      progress: false,
    },
  },
  transpileDependencies: [
    'vuetify'
  ],
  configureWebpack: {
    module: {
      rules: [{
        test: /\.md$/,
        loader: 'raw-loader' // npm install -D raw-loader
      }, {
        test: /\.gradle$/,
        loader: 'raw-loader' // npm install -D raw-loader
      }]
    }
  }
})
