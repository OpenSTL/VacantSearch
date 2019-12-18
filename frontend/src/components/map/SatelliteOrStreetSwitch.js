import { connect } from 'react-redux';
import React, { Component } from 'react';

import * as mapStyles from '../../constants/map-styles';
import { getMapStyle } from '../../selectors';
import { setMapStyle } from '../../actions';

const mapStateToProps = state => {
  return {
    mapStyle: getMapStyle(state),
  };
};

class SatelliteOrStreetSwitch extends Component {
  onChange(e) {
    const mapStyle = e.target.value;
    this.props.setMapStyle(mapStyle);
  }
  render() {
    return (
      <select
        onChange={(e) => this.onChange(e)}
        value={this.props.mapStyle}
      >
        <option value={mapStyles.STREET}>Streets</option>
        <option value={mapStyles.SATELLITE}>Satellite</option>
      </select>
    );
  }
}
export default connect(mapStateToProps, { setMapStyle })(SatelliteOrStreetSwitch);
