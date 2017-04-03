import React, { Component } from 'react';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userLatitude: null,
      userLongitud: null,
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
          userLatitude: pos.coords.latitude,
          userLongitud: pos.coords.longitude,
        });
        this.getPlacesData();
      },
      err => {
        console.log(err);
      },
    );
  }

  getPlacesData() {

  }

  render() {
    return <div className="App" />;
  }
}

export default App;
