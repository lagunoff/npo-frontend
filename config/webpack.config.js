'use strict';
require('babel-register');
const webpackConfigTemplate = require('./webpack.config.tpl').default;
const config = require('./nconf');

module.exports = webpackConfigTemplate(config);
