import React from 'react';
import transitions from 'material-ui/styles/transitions';

class SubmenuAnimation extends React.Component {

  static propTypes = {
    // стили
    style: React.PropTypes.object,

    // дочерние элементы
    children: React.PropTypes.node,

    // количество пунктов меню
    numItems: React.PropTypes.number,
  };
  
  state = { collapsed: true, }

  componentWillAppear(callback) {
    this.setState({ collapsed: false, });
    callback();
  }

  componentWillEnter(callback) {
    this.setState({ collapsed: false, });
    callback();
  }

  componentWillLeave(callback) {
    this.setState({ collapsed: true, });
    setTimeout(callback, 450);
  }

  getStyles() {
    return {
      height: this.state.collapsed ? 0 : this.props.numItems * 40 + 8,
      overflow: 'hidden',
      position: 'relative',
      transition: transitions.create('450ms', null, null, transitions.easeOutFunction),
      ...this.props.styles,
    };
  }

  render() {
    const rootStyles = this.getStyles();
    return (
      <div style={rootStyles}>{this.props.children}</div>
    );
  }
}

export default SubmenuAnimation;
