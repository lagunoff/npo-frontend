'use strict';
/* eslint-disable */
const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

/**
 * Возвращает webpack-конфиг, сформированный в соответствии с переданным
 * конфигом приложения
 * @param {object} config - конфиг окружения из config/config.get('yml')
 * returns {object} webpack-конфиг
 */
export default function webpackConfigTemplate(config) {

  // точки входа для отдельных бандлов
  const entry = {
    // основной бандл для приложения
    app: ['./src/entry.js'],
  };

  // добавляем полифилы
  // TODO: запилить полифилы в отдельный полифил-сервис
  if (config.get('inject_polyfills')) {
    entry.app.unshift('babel-polyfill');
  }

  // скрипты, которые получают оповещения об обновлении от
  // hot-reload-middlware
  if (config.get('use_hot_reload')) {
    entry.app.unshift('webpack-hot-middleware/client');
  }

  const output = {
    // директория для скомпилированых файлов
    path: path.join(__dirname, '../public'),

    // шаблон имени сгенерированных js файлов
    filename: config.get('use_hash_in_js_filenames') ? '[name]-[chunkhash].js' : '[name].js',

    // шаблон имени сгенерированных js файлов
    chunkFilename: config.get('use_hash_in_js_filenames') ? '[id]-[chunkhash].js' : '[id].js',

    // url директории с ресурсами
    publicPath: config.get('public_path') || '/',
  };

  // loader'ы для js(х) файлов
  const jsLoaders = ['babel-loader?presets[]=react&presets[]=es2015&presets[]=stage-0'];
  if (config.get('use_hot_reload')) {
    jsLoaders.unshift('react-hot-loader');
  }


  // шаблон имени файла для статических файлов
  const fileLoaderFilenameTemplate = config.get('use_hash_in_static_filenames') ? '[name]-[hash].[ext]' : '[name].[ext]';

  // константы, определенные в исходном коде, не являются переменными, вместо
  // имени константы подставляется ее текстовое содержимое, используется в
  // webpack.DefinePlugin
  // https://webpack.github.io/docs/list-of-plugins.html#defineplugin
  const symbolicConstants = {
    __CONFIG__: JSON.stringify(config.get('client')),
  };

  // выключаем дебаг в React.js
  if (!config.get('debug_reactjs')) {
    symbolicConstants['process.env'] = {
      NODE_ENV: JSON.stringify('production'),
    };
  }

  // webpack плагины https://webpack.github.io/docs/list-of-plugins.html
  const plugins = [
    // страница index.html
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.join(__dirname, 'html-webpack-template.js'),
      inject: false,
      chunks: ['app'],
    }),

    // константы
    new webpack.DefinePlugin(symbolicConstants),

    // https://webpack.github.io/docs/list-of-plugins.html#occurrenceorderplugin
    new webpack.optimize.OccurenceOrderPlugin(),

    // https://webpack.github.io/docs/list-of-plugins.html#noerrorsplugin
    new webpack.NoErrorsPlugin(),
  ];

  // минификация js
  if (config.get('minimize_js')) {
    const uglifyJsParams = {
      minimize: true,
      compress: { warnings: false },
    };
    if (config.get('webpack_devtool')) {
      uglifyJsParams.sourceMap = true;
    }

    plugins.push(new webpack.optimize.UglifyJsPlugin(uglifyJsParams));
  }

  // hot-reload
  if (config.get('use_hot_reload')) {
    plugins.push(new webpack.HotModuleReplacementPlugin());
  }

  // поиск дубликатов модулей (не использовать совместно с hot-reload)
  if (config.get('enable_dedup')) {
    plugins.push(new webpack.optimize.DedupePlugin());
  }

  // создание *.gz для каждого файла
  if (config.get('generate_compressed_files')) {
    plugins.push(new CompressionPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      // test: /\.js$|\.html$|\.css$|\.ttf$|\.woff(2)?$|\.otf$|\.eot$/,
      minRatio: 0.8,
    }));
  }

  // source-map, etc https://webpack.github.io/docs/configuration.html#devtool
  let devtool = null;
  if (config.get('webpack_devtool')) {
    devtool = config.get('webpack_devtool');
  }

  const module = {
    loaders: [{
      test: /\.jsx?$/,
      loaders: jsLoaders,
      exclude: /(node_modules|bower_components)/,
    }, {
      test: /\.css$/,
      loaders: ['style-loader', 'css-loader'],
    }, {
      test: /\.json$/,
      loaders: ['json-loader']
    }, {
      test: /\.(png|jpg|jpeg|gif|ttf|otf|eot|woff(2)?)(\?[a-z0-9]+)?$/,
      loaders: [`file-loader?name=${fileLoaderFilenameTemplate}`]
    }, {
      test: /.*node_modules\/roboto-fontface.*\.svg$/,
      loaders: [`file-loader?name=${fileLoaderFilenameTemplate}`]
    }, {
      test: /\.svg$/,
      loader: 'svg-inline'
    }],
  };

  const resolve = {
    modulesDirectories: [
      'src',
      'node_modules'
    ],
    extensions: ['', '.json', '.js', '.jsx'],
    alias: {
      'react': path.resolve(__dirname, '../node_modules/react'),
      'react-dom': path.resolve(__dirname, '../node_modules/react-dom'),
      'lodash': path.resolve(__dirname, '../node_modules/lodash'),
    },
    root: [
      path.resolve(__dirname, '../'),
    ]
  };

  return {
    entry,
    output,
    module,
    resolve,
    colors: true,
    progress: true,
    plugins,
    devtool,
  };
}
/* eslint-enable */
