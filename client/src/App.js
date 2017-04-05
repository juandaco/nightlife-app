import React, { Component } from 'react';

// For Material-UI
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();
// Material UI Components
import { CircularProgress, TextField } from 'material-ui';
// Icons
import SvgIconSearch from 'material-ui/svg-icons/action/search';

//
import ApiCalls from './ApiCalls';
import config from './config';
// Components
import PlaceCard from './components/PlaceCard';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: '',
      searching: false,
      placesData: [],
      placesCount: [],
      userLogged: false,
      userPlaces: [],
      userLastSearch: '',
    };

    // Function Bindings
    this.verifyUser = this.verifyUser.bind(this);
    this.getPlacesData = this.getPlacesData.bind(this);
    this.getUserData = this.getUserData.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleSearchEnter = this.handleSearchEnter.bind(this);
    this.setupCards = this.setupCards.bind(this);
    this.addPlace = this.addPlace.bind(this);
    this.getPlacesCount = this.getPlacesCount.bind(this);
  }

  componentDidMount() {
    this.verifyUser();
    this.getPlacesCount();
  }

  getPlacesCount() {
    ApiCalls.getPlacesCount()
      .then(resp => {
        console.log(resp);
      })
      .catch(e => console.log(e));
  }

  verifyUser() {
    ApiCalls.verifyUser()
      .then(resp => {
        if (resp.userLogged) {
          this.getUserData();
          this.setState({
            userLogged: true,
          });
        }
      })
      .catch(e => console.log(e));
  }

  getUserData() {
    ApiCalls.getUserData()
      .then(resp => {
        if (resp.lastSearch) {
          this.setState({
            searchValue: resp.lastSearch,
          });
          this.getPlacesData();
        }
        this.setState({
          userPlaces: resp.places,
          userLastSearch: resp.lastSearch,
        });
      })
      .catch(e => console.log(e));
  }

  loginUser() {
    let w = 360;
    let h = 560;
    const left = screen.width / 2 - w / 2;
    const top = screen.height / 2 - h / 2;
    const windowOptions = `width=${w}, height=${h}, top=${top}, left=${left}`;
    const authURL = `${config.appURL}/auth/twitter`;
    const oAuthPopUp = window.open(authURL, 'Login', windowOptions);
    // For AutoClosing the popUp once we get an answer
    window.addEventListener(
      'message',
      e => {
        if (e.data === 'closePopUp') {
          oAuthPopUp.close();
          this.verifyUser();
          window.removeEventListener('message', function(e) {}, false);
        }
      },
      false,
    );
  }

  addPlace(placeID) {
    if (this.state.userLogged) {
      // Add Place to to User
      if (!this.state.userPlaces.includes(placeID)) {
        ApiCalls.addUserPlace(placeID)
          .then(resp => {
            if (resp.nModified) {
              let newPlaces = this.state.userPlaces.slice();
              newPlaces.push(placeID);
              this.setState({
                userPlaces: newPlaces,
              });
            }
          })
          .catch(e => console.log(e));
      } else {
        ApiCalls.removeUserPlace(placeID)
          .then(resp => {
            if (resp.nModified) {
              let newPlaces = this.state.userPlaces.slice();
              newPlaces.splice(newPlaces.indexOf(placeID), 1);
              this.setState({
                userPlaces: newPlaces,
              });
            }
          })
          .catch(e => console.log(e));
      }
    } else {
      this.loginUser();
    }
  }

  handleSearchChange(e) {
    this.setState({
      searchValue: e.target.value,
    });
  }

  handleSearchEnter(e) {
    if (e.key === 'Enter') {
      e.target.blur();
      this.getPlacesData();
      if (this.state.userLogged) {
        ApiCalls.setUserSearch(this.state.searchValue)
          .then(resp => {
            if (resp.nModified) {
              this.setState({
                userLastSearch: this.state.searchValue,
              });
            }
          })
          .catch(e => console.log(e));
      }
    }
  }

  getPlacesData(e) {
    this.setState({ searching: true });
    ApiCalls.getPlacesData(this.state.searchValue)
      .then(places => {
        this.setState({
          placesData: places,
          searching: false,
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  setupCards() {
    if (!this.state.searching) {
      return this.state.placesData.map(place => {
        return (
          <PlaceCard
            key={place.id}
            placeID={place.id}
            name={place.name}
            photo={place.image_url}
            url={place.url}
            going={this.state.userPlaces.includes(place.id)}
            addPlace={this.addPlace}
          />
        );
      });
    } else {
      return null;
    }
  }

  render() {
    const cards = this.setupCards();
    return (
      <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
        <div
          className="app-container"
          style={{
            margin: 0,
            padding: 0,
            paddingTop: 100,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div className="search-field" style={{ marginBottom: 40 }}>
            <TextField
              hintText="What's your City?"
              value={this.state.searchValue}
              onChange={this.handleSearchChange}
              onKeyPress={this.handleSearchEnter}
            />
            <SvgIconSearch />
          </div>
          <div className="cards-container">
            {this.state.searching
              ? <CircularProgress style={{ paddingTop: 50 }} />
              : null}
            {cards}
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
