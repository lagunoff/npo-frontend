import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom/server';
import Helmet from 'react-helmet';

/**
 * Wrapper component containing HTML metadata and boilerplate tags.
 * Used in server-side code only to wrap the string output of the
 * rendered route component.
 *
 * The only thing this component doesn't (and can't) include is the
 * HTML doctype declaration, which is added to the rendered output
 * by the server.js file.
 */
export default class Html extends Component {
  static propTypes = {
    assets: PropTypes.object,
    component: PropTypes.node,
  };

  render() {
    const { assets, component, } = this.props;
    const content = component ? ReactDOM.renderToString(component) : '';
    const head = Helmet.rewind();

    return (
      <html lang="ru">
        <head>
          {head.base.toComponent()}
          {head.title.toComponent()}
          {head.meta.toComponent()}
          {head.link.toComponent()}
          {head.script.toComponent()}
          <meta charSet="utf-8"/>
          {assets.stylesheets.map((style, key) =>
            <link href={style} key={key} media="screen, projection"
              rel="stylesheet" type="text/css" charSet="UTF-8"/>
           )}
        </head>
        <body>
          <div id="app"></div>
          {assets.javascript.map((script, index) => (
             <script key={index} src={script} charSet="UTF-8"/>
          ))}
        </body>
      </html>
    );
  }
}
