import '../node_modules/normalize.css/normalize.css';
import '../node_modules/roboto-fontface/css/roboto-fontface.css';

import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { Router, Route, IndexRedirect, Redirect, hashHistory } from 'react-router';
import floors from '../config/floors';
import App from './components/App';
import IndexPage from './components/IndexPage';
import Logger from './utils/Logger';

// конфиг из config/app.yml
const config = __CONFIG__;

// подключаем обработчик ошибок, если включен логгинг
if (config.use_logging) {
  const loggerInstance = new Logger(config.logging_url);
  window.onerror = function (message, source, lineno, colno, error) {
    loggerInstance.log(message, source, lineno, colno, error);
  }
}

// необходимо для работы material-ui
injectTapEventPlugin();

const firstFloorId = floors[0].id;
const firstFloorRedirectPath = `/floors/${firstFloorId}`;

ReactDOM.render(
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRedirect to={firstFloorRedirectPath}/> 
      <Route path="floors/:floorId/rooms/:roomId" component={IndexPage}/>
      <Route path="floors/:floorId/rooms/" component={IndexPage}/>
      <Route path="floors/:floorId" component={IndexPage}/>
      <Route path="floors/" component={IndexPage}/>
    </Route>
    <Redirect path="*" to={firstFloorRedirectPath}/>
  </Router>,
  document.getElementById('app')
);

