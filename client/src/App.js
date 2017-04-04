import React, { Component } from 'react';

// For Material-UI
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();
// Material UI Components
import { AppBar, Drawer, MenuItem, CircularProgress, IconButton } from 'material-ui';

//
import ApiCalls from './ApiCalls';
// Components

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location: '',
      placesData: [],
      openDrawer: false,
    };

    // Function Bindings
    this.getUserLocation = this.getUserLocation.bind(this);
    this.getPlacesData = this.getPlacesData.bind(this);
    this.openDrawer = this.openDrawer.bind(this);
    this.closeDrawer = this.closeDrawer.bind(this);
  }

  componentDidMount() {
    this.getUserLocation();
  }

  openDrawer() {
    this.setState({
      openDrawer: true,
    });
  }

  closeDrawer() {
    this.setState({
      openDrawer: false,
    });
  }

  getUserLocation() {
    navigator.geolocation.getCurrentPosition(
      pos => {
        this.setState({
          location: `${pos.coords.latitude},${pos.coords.longitude}`,
        });
        this.getPlacesData();
      },
      err => {
        console.log(err);
      },
    );
  }

  getPlacesData() {
    ApiCalls.getPlacesData(this.state.location)
      .then(places => {
        this.setState({
          placesData: places.results,
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
        <div className="app-container">
          <AppBar
            title="Nightlife"
            onLeftIconButtonTouchTap={this.openDrawer}
            iconElementRight={<IconButton iconClassName="muidocs-icon-custom-github"/>}
          />
          <Drawer
            docked={false}
            open={this.state.openDrawer}
            onRequestChange={open => this.setState({ openDrawer: open })}
            swipeAreaWidth={100}
          >
            <MenuItem onTouchTap={this.closeDrawer}>Menu Item</MenuItem>
            <MenuItem onTouchTap={this.closeDrawer}>Menu Item 2</MenuItem>
          </Drawer>
          {/*<CircularProgress size={40} thickness={5} />*/}
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
