import serializeError from 'serialize-error';

export default class Logger {

  /**
   * @param {string} url - url для отправки запроса с сообщением об ошибке
   */
  constructor(url) {
    this._url = url;
  }
  
  /**
   * Отправка POST запроса с json сообщением об ошибке
   * @param {string} message - сообщение об ошибке
   * @param {string} source - файл с исходным кодом, в котором произошла
   * ошибка
   * @param {number} lineno - строка исходного кода, которая вызвала ошибку
   * @param {number} colno - номер столбца, где произошла ошибка
   * @param {Error} error - объект `Error`
   */
  log(message, source, lineno, colno, error) {
    const now = new Date();
    const url = window.customLoggingUrl || this._url;
    
    const additional = {
      occuredAt: now.toISOString(),
      userAgent: navigator.userAgent,
      location: location.href,
    };

    const xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.setRequestHeader('Content-Type', 'application/json');
    
    xhr.send(JSON.stringify({
      message,
      source,
      lineno,
      colno,
      additional,
      error: (error instanceof Error) ? serializeError(error) : undefined,
    }));
  }
}
