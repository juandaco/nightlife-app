import React, { Component } from 'react';
import ApiCalls from './ApiCalls';
// Components

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location: '',
      placesData: [],
    };

    // Function Bindings
    this.getUserLocation = this.getUserLocation.bind(this);
    this.getPlacesData = this.getPlacesData.bind(this);
  }

  componentDidMount() {
    this.getUserLocation();
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
    return <div className="App" />;
  }
}

export default App;
