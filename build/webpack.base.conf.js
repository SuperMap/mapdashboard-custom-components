const path = require('path');
const utils = require('./utils');
const components = require('../src/components.json');

function resolve(dir) {
  return path.join(__dirname, '..', dir);
}

const entries = {};
for (let key in components) {
  const component = components[key];
  const uriFileName = component.uri.replace(/^\.\/(.*)\.\w+$/, '$1');
  entries[uriFileName] = resolve(`src/${component.uri}.vue`);
  if (component.settingUri) {
    const settingFileName = component.settingUri.replace(/^\.\/(.*)\.\w+$/, '$1');
    entries[settingFileName] = resolve(`src/${component.settingUri}.vue`);
  }
}

module.exports = {
  context: path.resolve(__dirname, '../'),
  // 此处引入要打包的组件
  entry: entries,
  // 输出到静态目录下
  output: {
    path: resolve('static'),
    filename: 'static/[name].js',
    publicPath: '/'
  },
  resolve: {
    extensions: ['.ts', '.js', '.vue', '.json'],
    modules: ['node_modules'],
    alias: {
      vue$: "vue/dist/vue.esm.js",
      '@': resolve('src')
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          esModule: false,
          loaders: utils.cssLoaders({
            sourceMap: true
          }),
          cssSourceMap: true,
          cacheBusting: true,
          transformToRequire: {
            video: ['src', 'poster'],
            source: 'src',
            img: 'src',
            image: 'xlink:href'
          }
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [
          resolve('src'),
          resolve('node_modules/webpack-dev-server/client'),
          resolve('node_modules/@supermap/vue-iclient-mapboxgl/src')
        ]
      },
      {
        test: /\.(ts|tsx)$/,
        include: [resolve('src'), resolve('node_modules/@supermap/vue-iclient-mapboxgl')],
        use: [
          {
            loader: 'babel-loader'
          },
          {
            loader: 'ts-loader',
            options: {
              appendTsSuffixTo: [/\.vue$/]
            }
          }
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 200000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      },
      ...utils.styleLoaders({
        sourceMap: true,
        usePostCSS: true
      })
    ]
  },
  node: {
    setImmediate: false,
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  }
};
