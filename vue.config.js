const path = require('path');

function resolve(dir = '') {
  return path.join(__dirname, './src', dir);
}
const Version = new Date().getTime();
module.exports = {
  publicPath: './',
  outputDir: 'dist',
  assetsDir: 'static',
  productionSourceMap: false,
  devServer: {
    //九键输入法的 「mall」= 「6255」
    port: 6255,
    proxy: {
      'chat_server/wx': {
        target: 'https://www.xplanx.com/'
      },
      'localhost': {
        target: 'ws://0.0.0.0:6103/ws',
        ws: true,
        headers: {
          "Access-Control-Allow-Origin": "*"
        }
      }
    },
  },
  chainWebpack: config => {
    config.plugins.delete('prefetch');
    config.plugins.delete('preload');
  },
  configureWebpack: {
    resolve: {
      alias: {
        core: resolve('core')
      }
    },
    optimization: {
      runtimeChunk: {
        name: entrypoint => `runtime~${entrypoint.name}`
      },
      splitChunks: {
        minChunks: 2,
        minSize: 20000,
        maxAsyncRequests: 20,
        maxInitialRequests: 30,
        name: false
      }
    },
    /*打包配置版本号*/
    output: {/*模块名称+时间戳*/
      filename: `static/js/[name].${Version}.js`,
      chunkFilename: `static/js/[name].${Version}.js`,
    }
  },
  css: {
    loaderOptions: {
      sass: {
        data:
          '@import "@/assets/scss/_var.scss";@import "@/assets/scss/_mixin.scss";'
      }
    }
  }
};
