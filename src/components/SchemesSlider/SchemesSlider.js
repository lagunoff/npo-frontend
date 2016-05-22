import React from 'react';
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
import TransitionGroup from 'react-addons-transition-group';
import * as colors from 'material-ui/styles/colors';
import Schema from '../Schema';
import SchemaAnimation from './SchemaAnimation';

class SchemesSlider extends React.Component {

  static propTypes = {
    // стили
    style: React.PropTypes.object,

    // список схем
    schemes: React.PropTypes.array.isRequired,

    // id выбранной схемы
    selectedScheme: React.PropTypes.string,

    // id подсвечиваемой комнаты
    highlightedRoom: React.PropTypes.string,
    
    // коллбек при вхождени курсора в область комнаты
    onRoomMouseEnter: React.PropTypes.func,

    // коллбек при выходе курсора из область комнаты
    onRoomMouseLeave: React.PropTypes.func,

  };

  static contextTypes = {
    muiTheme: React.PropTypes.object.isRequired,
  };

  _handleButtonTouchTap = (schemeId) => {
    this.props.onSelectScheme && this.props.onSelectScheme(schemeId);
  };

  _handleRoomMouseEnter = (roomId) => {
    this.props.onRoomMouseEnter && this.props.onRoomMouseEnter(roomId);
  };

  _handleRoomMouseLeave = (roomId) => {
    this.props.onRoomMouseLeave && this.props.onRoomMouseLeave(roomId);
  };

  getStyles() {
    const { spacing, palette } = this.context.muiTheme;

    return {
      root: {
        ...this.props.styles,
      },
      transitionGroup: {
        position: 'relative',
        overflow: 'visible',
        display: 'block',
        width: '100%',
        height: 606,
      },
      header: {
        fontSize: 24,
        marginBottom: spacing.desktopGutterLess,
        fontWeight: 400,
        textAlign: 'center',
        color: palette.primary1Color,
      },
    };    
  }
  
  render() {
    const styles = this.getStyles();
    
    const selectedScheme = this.props.selectedScheme ? this.props.schemes.find(schema => (
      schema.id == this.props.selectedScheme
    )) : null;
    
    const transitionGroupItems = selectedScheme ? (
      <SchemaAnimation key={selectedScheme.id}>
        <Schema
          style={styles.schema}
          schema={selectedScheme}
          highlightedRoom={this.props.highlightedRoom}
          onRoomMouseEnter={this._handleRoomMouseEnter}
          onRoomMouseLeave={this._handleRoomMouseLeave}
        />
      </SchemaAnimation>
    ) : null;
    
    return (
      <div style={styles.root}>
        <h2 style={styles.header}>{selectedScheme && selectedScheme.heading}</h2>
        <TransitionGroup style={styles.transitionGroup}>
          {transitionGroupItems}
        </TransitionGroup>
      </div>
    );
  }
}

export default SchemesSlider;
