import { connect } from 'react-redux';
import React, { Component } from 'react';
import { setMapStyle } from '../../actions';

class SwitchStreetToSatellite extends Component {
    onChange(e) {
        const mapStyle = e.target.value;
        this.props.setMapStyle(mapStyle);
    }
    render() {
        return (
            <div className='switch-container switch-street-to-satellite-container'>
                <select id='switch-street-to-satellite' onChange={(e) => this.onChange(e)}>
                    <option value="streets">Streets</option>
                    <option value="satellite">Satellite</option>
                </select>
            </div>
        );
    }
}
export default connect(null, { setMapStyle })(SwitchStreetToSatellite);
