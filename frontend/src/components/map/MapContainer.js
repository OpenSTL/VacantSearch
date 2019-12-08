import React from 'react';
import Map from './Map';
import MapTopToolbar from './MapTopToolbar';
import SatelliteOrStreetSwitch from './SatelliteOrStreetSwitch';

function MapContainer() {
  return (
    <div className='map-container'>
      <Map />
      <MapTopToolbar>
        <SatelliteOrStreetSwitch />
      </MapTopToolbar>
    </div>
  )
}
export default MapContainer;
