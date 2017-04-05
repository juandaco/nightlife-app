import React, { Component } from 'react';
import { FlatButton } from 'material-ui';
import {
  Card,
  CardActions,
  CardMedia,
  CardTitle,
  CardText,
} from 'material-ui/Card';
import SvgIconAdd from 'material-ui/svg-icons/content/add-circle';
import SvgIconGoing from 'material-ui/svg-icons/action/check-circle';
import ApiCalls from '../ApiCalls';

class PlaceCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      placeID: this.props.placeID,
      review: '',
    };
    // Function Bindings
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    ApiCalls.getPlaceReview(this.props.placeID)
      .then(review => {
        this.setState({
          review,
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  handleChange() {
    this.props.addPlace(this.state.placeID); 
  }

  render() {
    const cardStyle = {
      width: '35vw',
      minWidth: 350,
      margin: '10px 10px',
      textAlign: 'left',
    };
    return (
      <Card style={cardStyle}>
        <CardMedia>
          <img src={this.props.photo} alt={this.props.name} />
        </CardMedia>
        <CardTitle title={this.props.name} style={{ paddingBottom: 0 }} />
        <CardText style={{ paddingTop: 5, paddingBottom: 0 }}>
          {this.state.review}
        </CardText>
        <CardActions style={{ textAlign: 'right' }}>
          <FlatButton href={this.props.url} target="_blank" label="More Info" />
          <FlatButton
            label={this.props.going ? 'Going' : 'Add'}
            labelPosition="before"
            icon={
              this.props.going
                ? <SvgIconGoing style={{ width: 20, leftMaring: -5 }} />
                : <SvgIconAdd style={{ width: 20 }} />
            }
            onClick={this.handleChange}
            style={{ width: 100 }}
          />
        </CardActions>
      </Card>
    );
  }
}

export default PlaceCard;
