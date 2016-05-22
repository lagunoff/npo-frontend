'use strict';
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const Html = require('../src/utils/Html').default;

module.exports = function renderHtmlWebpackTemplate(templateParams) {
  const element = React.createElement(Html, {
    assets: {
      javascript: templateParams.htmlWebpackPlugin.files.js,
      stylesheets: templateParams.htmlWebpackPlugin.files.css,
    },
  });
  const html = ReactDOMServer.renderToStaticMarkup(element);
  return `<!doctype html>\n${html}`;
};
