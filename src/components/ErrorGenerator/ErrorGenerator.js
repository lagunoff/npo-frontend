import React from 'react';
import TextField from 'material-ui/TextField';
import Snackbar from 'material-ui/Snackbar';
import RaisedButton from 'material-ui/RaisedButton';
import color from 'color';
import * as colors from 'material-ui/styles/colors';

import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';


class ErrorGenerator extends React.Component {

  static propTypes = {
    // стили
    style: React.PropTypes.node.isRequired,
  };

  static contextTypes = {
    muiTheme: React.PropTypes.object.isRequired,
    config: React.PropTypes.object.isRequired,
  };
  
  state = {
    loggingUrl: this.context.config.logging_url,
    errorType: 'undefined_variable',
    caughtError: null,
    showSnackbar: false,
  };
  
  componentDidMount() {
    this._listener = window.onerror;
    window.onerror = (...args) => {
      this._catchError(...args);
      this._listener && this._listener(...args);
    }
  }
  
  componentWillUnmount() {
    window.onerror = this._listener;
  }
  
  _handleErrorTypeChange = (event) => {
    this.setState({ errorType: event.target.value, });
  };

  _handleLoggingUrlChange = (event) => {
    window.customLoggingUrl = event.target.value;
    this.setState({ loggingUrl: event.target.value, });
  };

  _generateError = () => {
    switch(this.state.errorType) {
      case 'undefined_variable':
        __tB97_SOME_khN9_INCREDIBLE_t0L9_UNDEFINED_bU7W_VARIABLE__ = null;
        break;
      case 'invalid_syntax':
        eval('#');
        break;
      case 'undefined_property':
        undefined.id;
        break;
    }
  };
  
  _catchError = (message, source, lineno, colno, error) => {
    this.setState({ caughtError: error, showSnackbar: true, })
  };
  
  _handleRequestCloseSnackbar = () => {
    this.setState({ caughtError: null, showSnackbar: false, })
  };
  
  getStyles() {
    const { spacing, palette } = this.context.muiTheme;

    return {
      root: {
        ...this.props.style,
      },
      text: {
        fontSize: 13,
        lineHeight: '24px',
      },
      loggingUrl: {
        marginBottom: spacing.desktopGutterLess,
      },
      errorType: {
        marginBottom: spacing.desktopGutterLess,
      },
      radioButton: {
        marginBottom: spacing.desktopGutterMini,
        marginTop: spacing.desktopGutterMini,
      },
      buttonWrapper: {
        textAlign: 'center',
      },
      label: {
        fontSize: 13,
        color: color(palette.textColor).alpha(0.54).rgbString(),
        display: 'block',
      },
      error: {
        fontSize: 13,
        lineHeight: '24px',
        color: colors.red700,
      },
    };    
  }
  
  render() {
    const styles = this.getStyles();
    const snackbarMessage = this.state.caughtError ? `Произошла ошибка: ${this.state.caughtError.constructor.name}` : '';
    const fromFilesystem = location.protocol === 'file:';
    return (
      <div style={styles.root}>
        <p style={styles.text}>
          Здесь можно проверить работу логгирования ошибок. Можно
          указать url для отправки отчетов (необходимо настроить CORS
          на сервере) или посмотреть запрос в инспекторе. Запрос будет
          отправлен методом POST, Content-Type: application/json
        </p>
        <TextField
          value={this.state.loggingUrl}
          name="logging_url"
          floatingLabelText="URL для отправки отчета"
          onChange={this._handleLoggingUrlChange}
          style={styles.loggingUrl}
        />
        <label style={styles.label}>Тип ошибки</label>
        <RadioButtonGroup
          name="errorType"
          value={this.state.errorType}
          defaultSelected={this.state.errorType}
          onChange={this._handleErrorTypeChange}
          style={styles.errorType}
        >
          <RadioButton
            value="undefined_variable"
            label="Доступ к необъявленной переменной"
            style={styles.radioButton}
          />
          <RadioButton
            value="invalid_syntax"
            label="Синтаксическая ошибка"
            style={styles.radioButton}
          />
          <RadioButton
            value="undefined_property"
            label="Доступ к свойствам переменной, со значением undefined"
            style={styles.radioButton}
          />
        </RadioButtonGroup>
        <div style={styles.buttonWrapper}>
          {fromFilesystem && <p style={styles.error}>Отправка отчета возможна только со страницы, загруженной с веб домена</p>}
          <RaisedButton
            disabled={fromFilesystem || !this.state.loggingUrl.length}
            label="Генерировать ошибку"
            secondary={true}
            onTouchTap={this._generateError}
          />
        </div>
        <Snackbar
          open={this.state.showSnackbar}
          message={snackbarMessage}
          autoHideDuration={4000}
          onRequestClose={this._handleRequestCloseSnackbar}
          onActionTouchTap={this._handleRequestCloseSnackbar}
          action="OK"
        />
      </div>
    );
  }
}

export default ErrorGenerator;
