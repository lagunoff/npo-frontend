демо [http://lagunoff.github.io/npo/](http://lagunoff.github.io/npo/)

## Выбор инструментов

 * [babel](https://babeljs.io/) — трансформер ES6/ES7/JSX в ES5
 * [webpack](http://webpack.github.io/) — сборщик, hot-reload функционал
 * [react](https://facebook.github.io/react/) — библиотека для постоения UI компонентов
 * [react-router](https://github.com/reactjs/react-router) — роутер для React
 * [material-ui](http://material-ui.com/) — библиотека
компонентов React.js для построения интерфейсов в стиле
[Material design](https://www.google.com/design/spec/material-design/introduction.html)
 * [mocha](https://mochajs.org/) — запуск тестов
 * [chai](http://chaijs.com/) — библиотека assert'ов для BDD/TDD

## Файловая структура проекта

```sh
├── assets                        # статические файлы
│   └── ...
├── config                        # файлы настроек
│   ├── app.yml                   # основной конфиг проекта
│   ├── floors.js                 # список этажей, комнат, кабинетов
│   ├── html-webpack-template.js  # необходим для генерации index.html
│   ├── nconf.js                  # экспорт актуальной конфигурации
│   ├── webpack.config.js         # экспорт webpack конфига
│   └── webpack.config.tpl.js     # шаблон webpack конфига
├── public                        # скомпилированные файлы
│   └── ...
├── src
│   ├── components                # React.js компоненты
│   │   ├── Component             # пример компонента
│   │   │   ├── Component.js      # основной компонент
│   │   │   ├── Inferior.js       # вторичный компонент
│   │   │   └── package.json
│   ├── entry.js                  # точка входа для webpack бандла
│   └── utils
│       ├── Html.js               # шаблон страницы
│       └── Logger.js             # логирование ошибок
└── tmp
    └── ...
```

# Как реализуется подсвечивание комнат в схеме

Для реализации подсветки комнат произвольной формы используется
специально подготовленный SVG файл (`assets/floor0.svg` и
`assets/floor1.svg`), который накладывается поверх схемы, и который
имеет изначально скрытые фигуры над каждой комнатой. В компоненте
`Schema` SVG изображение встраивается в html код страницы, к фигурам
подцепляются обработчики событий mouseenter/mouseleave, которые
определяют id комнаты, над которой наведена мышь и вызывают переданные
в параметрах компонента `Schema` функции, которые меняют состояние
приложения, что в свою очередь вызывает обновление компонета `Schema`,
с переданным в параметрах id комнаты, которую необходимо подсветить,
затем в методе `componentWillReceiveProps` меняются прозрачности
необходимых фигур, так чтобы отображение схемы соответствовало
состоянию приложения.

## Отчет об ошибках

Отправка отчетов реализована в небольшом классе
`src/utils/Logger.js`. В методе `log` сериализуются все переданные
аргументы, к ним добавляются дополнителные поля с информацией о
текущем времени, версии браузера и проч. и отправляются на сервер
методом POST иcпользуя `XMLHttpRequest`. В файле `src/entry.js` во
время старта приложения к событию `window.onerror` подключается
обработчик, который вызывает метод `log` в экземпляре класса
`Logger`. URL для отправки отчетов задается в `config/app.yml` в
параметре `client.logging_url`. Для отключения отправки отчетов
необходимо указать `false` в параметре `client.use_logging` и
пересобрать проект. Пример отправляемого отчета:

```json
{
  "message": "Uncaught ReferenceError: __tB97_SOME_khN9_INCREDIBLE_t0L9_UNDEFINED_bU7W_VARIABLE__ is not defined",
  "source": "http://lagunoff.github.io/app-5629bb60a5b1e80de263.js",
  "lineno": 6,
  "colno": 15466,
  "additional": {
    "occuredAt": "2016-05-23T16:07:46.325Z",
    "userAgent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36",
    "location": "http://lagunoff.github.io/#/floors/6?_k=p66iej"
  },
  "error": {
    "name": "ReferenceError",
    "message": "__tB97_SOME_khN9_INCREDIBLE_t0L9_UNDEFINED_bU7W_VARIABLE__ is not defined",
    "stack": "ReferenceError: __tB97_SOME_khN9_INCREDIBLE_t0L9_UNDEFINED_bU7W_VARIABLE__ is not defined\n    at Object.ErrorGenerator._this._generateError [as onTouchTap] (http://lagunoff.github.io/app-5629bb60a5b1e80de263.js:22:31373)\n    at r.handleTouchTap (http://lagunoff.github.io/app-5629bb60a5b1e80de263.js:2:28084)\n    at Object.r (http://lagunoff.github.io/app-5629bb60a5b1e80de263.js:6:15305)\n    at a (http://lagunoff.github.io/app-5629bb60a5b1e80de263.js:3:5557)\n    at Object.u [as executeDispatchesInOrder] (http://lagunoff.github.io/app-5629bb60a5b1e80de263.js:3:5772)\n    at f (http://lagunoff.github.io/app-5629bb60a5b1e80de263.js:2:12757)\n    at d (http://lagunoff.github.io/app-5629bb60a5b1e80de263.js:2:12883)\n    at Array.forEach (native)\n    at n (http://lagunoff.github.io/app-5629bb60a5b1e80de263.js:22:21704)\n    at Object.h.processEventQueue (http://lagunoff.github.io/app-5629bb60a5b1e80de263.js:2:13837)"
  }
}
```
 
## Хранение конфигурации проекта

Проект может быть собран под разные "профили" (окружения), каждый из
которых имеет набор настроек и настраивается в
`config/app.yml`. Профиль для сборки задается опцией `--profile`:

```sh
# сборка проекта с использованием указанного профиля
$ npm run build -- --profile=<development|production|etc...>
```

Также, отдельные настройки, содержащиеся в профиле можно указать в
опциях командной строки или с помощью переменных окружения. Настройки
могут иметь произвольную вложенность.

```sh
# production сборка, с выключенными отчетами об ошибках
$ npm run build -- --profile=production --client:use-logging=0
# тоже самое
$ CLIENT__USE_LOGGING=0 npm run build -- --profile=production
```

```sh
# production сборка, но с выключенной минификацией скриптов
$ npm run build -- --profile=production --minimize-js=0
# тоже самое
$ MINIMIZE_JS=0 npm run build -- --profile=production
```

## Тестирование

При запуске тестов выполяются все файлы с расширением *.spec.js из
директории src. Пример спецификации в стиле BDD:

```js
// src/utils/Logger.spec.js
import { expect } from 'chai';
import Logger from './Logger';

describe('Logger', () => {

  it('should be able to use as a constructor with one argument', () => {
    expect(new Logger('http://google.com/')).to.be.ok;
  });
  
  it('should produce instance that has `log` method', () => {
    const instance = new Logger('http://google.com/');
    expect(instance).to.respondTo('log');
  });
  
});
```

```sh
# Запуск тестов
npm test
```

## Сборка проекта

Для сборки и запуска тестов необходимо иметь окружение с sh, find и rm

```sh
# Клонирование и сборка
git clone https://github.com/lagunoff/npo-frontend.git
cd npo-frontend
npm install
npm run build -- --profile=production
```
