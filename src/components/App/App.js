import './layout.css';
import React from 'react';
import { deepOrange500 } from 'material-ui/styles/colors';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

const muiTheme = getMuiTheme();

class App extends React.Component {

  static propTypes = {
    // react-router
    children: React.PropTypes.node.isRequired,
  };

  static childContextTypes = {
    config: React.PropTypes.object.isRequired,
  };
  
  getChildContext() {
    return {
      config: __CONFIG__,
    };
  }

  getStyles() {
    return {
      root: {
      },
    };    
  }
  
  render() {
    const styles = this.getStyles();
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div style={styles.root}>{this.props.children}</div>
      </MuiThemeProvider>
    );
  }
}

export default App;
