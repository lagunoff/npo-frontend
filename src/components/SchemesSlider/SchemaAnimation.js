import React from 'react';
import ReactDOM from 'react-dom';
import transitions from 'material-ui/styles/transitions';

class SchemaAnimation extends React.Component {

  static propTypes = {
    // стили
    style: React.PropTypes.object,

    // дочерние элементы
    children: React.PropTypes.node,
  };
  
  // `concealed_right` `exposed` `concealed_left`
  state = { disposition: 'concealed_right', };

  componentWillAppear(callback) {
    this.setState({ disposition: 'exposed', });
    callback();
  }

  componentWillEnter(callback) {
    const rootElement = ReactDOM.findDOMNode(this.refs.root);
    rootElement.offsetHeight;
    
    setTimeout(() => this.setState({ disposition: 'exposed', }), 100);
    callback();
  }

  componentWillLeave(callback) {
    this.setState({ disposition: 'concealed_left', });
    setTimeout(callback, 300);
  }

  getStyles() {
    const common = {
      position: 'absolute',
      width: '100%',
      height: '100%',
      transition: transitions.create('300ms', null, null, transitions.easeInOutFunction),
      ...this.props.style,
    };
    
    if (this.state.disposition === 'concealed_right') {
      return {
        ...common,
        left: '100%',
        opacity: 0,
      };
    }
    
    if (this.state.disposition === 'concealed_left') {
      return {
        ...common,
        transition: transitions.create('300ms', null, null, transitions.easeInOutFunction),
        left: '-100%',
        opacity: 0,
      };
    }

    return {
      ...common,
      left: 0,
      opacity: 1,
    };
  }

  render() {
    const rootStyles = this.getStyles();
    return (
      <div style={rootStyles} ref="root">{this.props.children}</div>
    );
  }
}

export default SchemaAnimation;
