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
// Components
import PlaceCard from './components/PlaceCard';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: '',
      searching: false,
      placesData: [],
    };

    // Function Bindings
    this.getPlacesData = this.getPlacesData.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.setupCards = this.setupCards.bind(this);
  }

  handleSearchChange(e) {
    this.setState({
      searchValue: e.target.value,
    });
  }

  getPlacesData(e) {
    if (e.key === 'Enter') {
      e.target.blur();
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
              onChange={this.handleSearchChange}
              onKeyPress={this.getPlacesData}
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
