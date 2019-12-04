import React from 'react';
import Map from './Map';
import SwitchStreetToSatellite from './SwitchStreetToSatellite';

function MapContainer() {
  return (
    <div className='map-container'>
      <Map />
      <SwitchStreetToSatellite />
    </div>
  )
}
export default MapContainer;
