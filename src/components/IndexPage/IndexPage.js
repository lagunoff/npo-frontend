import React from 'react';
import Helmet from 'react-helmet';
import InlineSVG from 'svg-inline-react';
import IconButton from 'material-ui/IconButton';
import Menu from '../Menu';
import * as colors from 'material-ui/styles/colors';
import SchemesSlider from '../SchemesSlider';
import ErrorGenerator from '../ErrorGenerator';
import floors from '../../../config/floors';
import githubIcon from '../../../assets/github.svg';

class IndexPage extends React.Component {

  static propTypes = {
    // react-router
    params: React.PropTypes.object.isRequired,
  };

  static contextTypes = {
    router: React.PropTypes.object.isRequired,
    muiTheme: React.PropTypes.object.isRequired,
    config: React.PropTypes.object.isRequired,
  };

  constructor(params) {
    super(params);
  }
  
  state = { highlightedRoom: null, };

  _handleFloorTouchTap = (floorId) => {
    this.context.router.push(`/floors/${floorId}`);
  };

  _handleRoomTouchTap = (roomId) => {
    const floorId = this.props.params.floorId;
    this.context.router.push(`/floors/${floorId}/rooms/${roomId}`);
  };

  _handleRoomMenuItemMouseEnter = (roomId) => {
    this.setState({ highlightedRoom: roomId, });
  };

  _handleRoomMenuItemMouseLeave = (roomId) => {
    if (this.state.highlightedRoom === roomId) {
      this.setState({ highlightedRoom: null, });
    }
  };

  getStyles() {
    const { spacing, palette } = this.context.muiTheme;

    return {
      root: {
        position: 'absolute',
        height: '100%',
        width: '100%',
        boxSizing: 'border-box',
        paddingLeft: 250,
        background: colors.grey50,
        overflowX: 'hidden',
        overflowY: 'scroll',
      },
      menu: {
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100%',
        width: 250,
        zIndex: 1000,
      },
      appBar: {
        height: 72,
        background: 'white',
        paddingTop: 20,
        paddingLeft: spacing.desktopGutter,
        borderBottom: `solid 1px ${palette.borderColor}`,
        boxSizing: 'border-box',
        position: 'relative',
      },
      headingH1: {
        fontSize: 24,
        fontWeight: 400,
        margin: 0,
        color: palette.primary1Color,
      },
      headingH2: {
        fontSize: 24,
        marginBottom: spacing.desktopGutterLess,
        fontWeight: 400,
        textAlign: 'center',
        color: palette.primary1Color,
      },
      headerGithubLink: {
        position: 'absolute',
        right: spacing.desktopGutterLess,
        top: 3,
        textDecoration: 'none',
      },
      headerGithubButton: {
        width: 64,
        height: 64,
      },
      content: {
        margin: `${spacing.desktopGutter * 2}px auto 0 auto`,
        width: 1046,
        minWidth: 768,
        maxWidth: '85%',
      },
      schemesSlider: {
        marginBottom: spacing.desktopGutter * 2,
      },
      footerGithubLink: {
        textDecoration: 'none',
      },
      footerGithubButton: {
        width: 64,
        height: 64,
      },
      errorGenerator: {
        marginBottom: spacing.desktopGutter * 2,
      },
      footer: {
        padding: spacing.desktopGutter,
        textAlign: 'center',
      },
    };
  }
    
  render() {
    const { floorId, roomId, } = this.props.params;
    
    const styles = this.getStyles();
    const floorListPosition = floorId === undefined ? 'main' : 'sidebar';
    
    const floor = floorId !== undefined ? (
      null
    ) : null;
    
    return (
      <div style={styles.root}>
        <Helmet title="Тестовое задание"/>
        <Menu
          style={styles.menu}
          floors={floors}
          selectedFloor={floorId}
          selectedRoom={roomId}
          highlightedRoom={this.state.highlightedRoom}
          onFloorTouchTap={this._handleFloorTouchTap}
          onRoomTouchTap={this._handleRoomTouchTap}
          onRoomMouseEnter={this._handleRoomMenuItemMouseEnter}
          onRoomMouseLeave={this._handleRoomMenuItemMouseLeave}
        />
        <div style={styles.appBar}>
          <h1 style={styles.headingH1}>Тестовое задание для НПО «Компьютер»</h1>
          <a href={this.context.config.github_url} style={styles.headerGithubLink} target="_blank">
            <IconButton style={styles.headerGithubButton}>
              <InlineSVG src={githubIcon}/>
            </IconButton>
          </a>
        </div>
        <div style={styles.content}>
          <SchemesSlider
            styles={styles.schemesSlider}
            schemes={floors}
            selectedScheme={floorId}
            highlightedRoom={this.state.highlightedRoom || roomId}
            onRoomMouseEnter={this._handleRoomMenuItemMouseEnter}
            onRoomMouseLeave={this._handleRoomMenuItemMouseLeave}
          />
          <h2 style={styles.headingH2}>Отчеты об ошибках</h2>
          <ErrorGenerator style={styles.errorGenerator}/>
          <div style={styles.footer}>
            <a href={this.context.config.github_url} style={styles.footerGithubLink} target="_blank">
              <IconButton style={styles.footerGithubButton}>
                <InlineSVG src={githubIcon}/>
              </IconButton>
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default IndexPage;
