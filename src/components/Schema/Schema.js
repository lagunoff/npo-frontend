import React from 'react';
import ReactDOM from 'react-dom';
import Camera from 'material-ui/svg-icons/image/camera';
import InlineSVG from 'svg-inline-react';
import * as colors from 'material-ui/styles/colors';

class Schema extends React.Component {

  static propTypes = {
    // стили
    style: React.PropTypes.object,

    // схема для отображения
    schema: React.PropTypes.object,
    
    // выделенная комната
    highlightedRoom: React.PropTypes.string,
    
    // коллбеки
    onRoomMouseEnter: React.PropTypes.func,
    onRoomMouseLeave: React.PropTypes.func,
  };
  
  // список SVG элементов, к которым подцеплены события
  _targets = [];
  
  componentDidMount() {
    this._connectCallbacksOnShapes();
  }

  componentWillUnmount() {
    this._disconnectCallbacksFromShapes();
  }
  
  componentWillReceiveProps(newProps) {
    if (newProps.highlightedRoom !== this.props.highlightedRoom) {
      // сменилась подсвечиваемая комната
      const svgWrapperElement = ReactDOM.findDOMNode(this.refs.svgWrapper);
      const svgElement = svgWrapperElement.querySelector('svg');
      if (this.props.highlightedRoom) {
        // скрываем активный елемент, если он существует
        const currentlySelectedElement = svgElement.querySelector(`#roomid-${this.props.highlightedRoom}`);
        currentlySelectedElement && (currentlySelectedElement.style.opacity = 0);
      }
      if (newProps.highlightedRoom) {
        // отображаем активный елемент
        const newlySelectedElement = svgElement.querySelector(`#roomid-${newProps.highlightedRoom}`);
        newlySelectedElement && (newlySelectedElement.style.opacity = 1);
      }
    }
  }
  
  /**
   * Подключение событий к SVG фигурам комнат
   */
  _connectCallbacksOnShapes() {
    const svgWrapperElement = ReactDOM.findDOMNode(this.refs.svgWrapper);
    const svgElement = svgWrapperElement.querySelector('svg');
    const shapesList = svgElement.querySelectorAll('[id]');

    Array.prototype.forEach.call(shapesList, shape => {
      if (/roomid-.+/.test(shape.id)) {
        shape.addEventListener('mouseenter', this._handleRoomMouseEnter);
        shape.addEventListener('mouseleave', this._handleRoomMouseLeave);
        this._targets.push(shape);
      }
    });
  }

  /**
   * Отключение событий
   */
  _disconnectCallbacksFromShapes() {
    for (let target of this._targets) {
      target.removeEventListener('mouseenter', this._handleRoomMouseEnter);
      target.removeEventListener('mouseleave', this._handleRoomMouseLeave);
    }
  }

  _handleRoomMouseEnter = (event) => {
    const matches = event.target.id.match(/roomid-(.*)/);
    if (matches && this.props.onRoomMouseEnter) {
      this.props.onRoomMouseEnter(matches[1]);
    }
  };
  
  _handleRoomMouseLeave = (event) => {
    const matches = event.target.id.match(/roomid-(.*)/);
    if (matches && this.props.onRoomMouseLeave) {
      this.props.onRoomMouseLeave(matches[1]);
    }
  };

  getStyles() {
    return {
      root: {
        position: 'relative',
        textAlign: 'center',
      },
      image: {
        width: '100%',
      },
      svgLayer: {
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 100,
        width: '100%',
      },
    };
  }

  render() {
    const styles = this.getStyles();

    const img = this.props.schema ? (
      <img src={this.props.schema.schema} style={styles.image}/>
    ) : null;
    
    const svg = (
      <div ref="svgWrapper" style={styles.svgLayer}>
        {this.props.schema && <InlineSVG element="div" src={this.props.schema.roomsSchema}/>}
      </div>
    );
    
    return (
      <div style={styles.root}>
        {img}
        {svg}
      </div>
    );
  }
}

export default Schema;
