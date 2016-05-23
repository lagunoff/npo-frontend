import React from 'react';
import { List, ListItem } from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import Divider from 'material-ui/Divider';
import ExpandLess from 'material-ui/svg-icons/navigation/expand-less';
import ExpandMore from 'material-ui/svg-icons/navigation/expand-more';
import TransitionGroup from 'react-addons-transition-group';
import logo from '../../../assets/logo.jpg';
import color from 'color';
import SubmenuAnimation from './SubmenuAnimation';

class Menu extends React.Component {

  static propTypes = {
    // стили
    style: React.PropTypes.object,
    itemStyle: React.PropTypes.object,

    // позиция меню main — основное содержимое, sidebar — слева
    position: React.PropTypes.oneOf(['main', 'sidebar']),
    
    // список этажей
    floors: React.PropTypes.array.isRequired,
    
    // выбранный этаж
    selectedFloor: React.PropTypes.string,

    // выбранная комната
    selectedRoom: React.PropTypes.string,

    // подсвечиваемая комната
    highlightedRoom: React.PropTypes.string,

    // коллбек при клике на этаже
    onFloorTouchTap: React.PropTypes.func,

    // коллбек при клике на комнате
    onRoomTouchTap: React.PropTypes.func,

    // коллбек при вхождени курсора в область пункта меню комнаты
    onRoomMouseEnter: React.PropTypes.func,

    // коллбек при выходе курсора из область пункта меню комнаты
    onRoomMouseLeave: React.PropTypes.func,

  };
  
  static defaultProps = {
    position: 'main',
  };
  
  static contextTypes = {
    muiTheme: React.PropTypes.object.isRequired,
  };
  
  _handleRoomTouchTap = (roomId) => {
    this.props.onRoomTouchTap && this.props.onRoomTouchTap(roomId);
  };

  _handleFloorTouchTap = (floorId) => {
    this.props.onFloorTouchTap && this.props.onFloorTouchTap(floorId);
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
	width: 300,
        boxShadow: 'rgba(0, 0, 0, 0.188235) 0px 0px 30px, rgba(0, 0, 0, 0.227451) 0px 0px 10px',
        background: 'white',
        overflowX: 'hidden',
        overflowY: 'auto',
        ...this.props.style,
      },
      header: {
        paddingTop: 20,
        paddingLeft: spacing.desktopGutterMini,
        height: 72,
        boxSizing: 'border-box',
      },
      logo: {
        width: 225,
      },
      item: {
        height: 40,
      },
      itemLabel: {
        fontSize: 13,
        fontWeight: 600,
        paddingTop: 13,
        paddingLeft: 56,
        paddingRight: 40,
      },
      selectedItem: {
        background: color(palette.textColor).alpha(0.1).rgbString(),
        backgroundColor: color(palette.textColor).alpha(0.1).rgbString(),
      },
      roomsList: {
        paddingTop: 0,
        width: '100%',
      },
      roomsListItem: {
        fontSize: 13,
        fontWeight: 600,
        color: color(palette.textColor).alpha(0.54).rgbString(),
        paddingLeft: 40,
        height: 40,
      },
      highlightedRoomListItem: {
        background: color(palette.textColor).alpha(0.1).rgbString(),
        backgroundColor: color(palette.textColor).alpha(0.1).rgbString(),
      },
      rightIcon: {
        top: -4,
      },
      leftIcon: {
        fontWeight: 400,
        display: 'inline-block',
        width: 24,
        height: 24,
        borderRadius: '50%',
        color: 'white',
        background: color(palette.textColor).alpha(0.54).rgbString(),
        textAlign: 'center',
        boxSizing: 'border-box',
        paddingTop: 4,
        top: -4,
      },
    };
  }
  
  renderRooms(rooms) {
    const styles = this.getStyles();

    return Array.isArray(rooms) ? rooms.map((room, index) => {
      const isActiveItem = this.props.selectedRoom == room.id;
      const isHighlightedItem = this.props.highlightedRoom == room.id;

      const listItemStyles = {
        ...styles.roomsListItem,
        ...(isHighlightedItem || isActiveItem) ? styles.highlightedRoomListItem : null,
      };
      
      const innerDivStyles = isActiveItem ? styles.highlightedRoomListItemInnerDiv : null;

      return (
        <ListItem
          key={`room-${room.id}`}
          style={listItemStyles}
          primaryText={room.title}
          onTouchTap={this._handleRoomTouchTap.bind(null, room.id)}
          onMouseEnter={this._handleRoomMouseEnter.bind(null, room.id)}
          onMouseLeave={this._handleRoomMouseLeave.bind(null, room.id)}
        />,
      );
    }) : null;
  }

  renderFloors(floors) {
    const styles = this.getStyles();
    return Array.isArray(floors) ? floors.map((floor, index) => {
      const isActiveItem = this.props.selectedFloor == floor.id;
      
      const rooms = this.renderRooms(floor.rooms);

      const listItemStyles = {
        ...styles.item,
        ...isActiveItem ? styles.selectedItem : null,
      };
      
      const leftIcon = (
        <span style={styles.leftIcon}>{floor.id}</span>
      );

      const rightIcon = this.props.selectedFloor == floor.id ? (
        <ExpandLess style={styles.rightIcon}/>
      ) : (
        <ExpandMore style={styles.rightIcon}/>
      );
      
      const roomsList = this.props.selectedFloor == floor.id ? (
        <SubmenuAnimation numItems={floor.rooms ? floor.rooms.length : 0}>
          <List style={styles.roomsList}>{rooms}</List>
        </SubmenuAnimation>
      ) : null;

      return [
        <ListItem
          key={`floor-${floor.id}`}
          style={listItemStyles}
          innerDivStyle={styles.itemLabel}
          primaryText={floor.title}
          onTouchTap={this._handleFloorTouchTap.bind(null, floor.id)}
          leftIcon={leftIcon}
          rightIcon={rightIcon}
        />,
        <TransitionGroup key={`rooms-${floor.id}`}>
          {roomsList}
        </TransitionGroup>
      ];
    }) : null;
  }
  
  render() {
    const styles = this.getStyles();
    const items = this.renderFloors(this.props.floors);
    
    return (
      <div style={styles.root}>
        <div style={styles.header}>
          <img style={styles.logo} src={logo} alt="Logo"/>
        </div>
        <Divider/>
        <List>
          {items}
        </List>
      </div>
    );
  }
}

export default Menu;
