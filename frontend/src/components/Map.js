import { connect } from 'react-redux';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import React, { Component } from 'react';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_KEY;

const mapStateToProps = state => {
  return { flyToCoordinates: state.flyToCoordinates };
};

class Map extends Component {
  componentDidMount() {
    const map = new mapboxgl.Map({
      // container id
      container: 'map', 
      // stylesheet location
      style: 'mapbox://styles/mrao2/cjzuiuexr09mn1crs8tz35s3k',
      // starting position [lng, lat]
      center: [-90.199402, 38.627003],
      // starting zoom
      zoom: 12,
    });
    this.map = map;
    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,    
      // further limit results to the geographic bounds representing the region of
      bbox: [-90.55234, 38.383975, -90.13074, 39.046325],
      country: 'us',
    });
    
    map.addControl(geocoder);
    
    map.on('load', function () {
    
      //added all parcels layer
      map.addSource('parcels', {
        "type": "vector",
        "url": "mapbox://mrao2.1h90kw7u"
      });
    
      map.addLayer({
        "id": "parcel-highlights",
        "type": "fill",
        "source": "parcels",
        "source-layer": "parcels-3swwt3",
        "paint": {
          "fill-outline-color": "rgba(238, 66, 244,1)",
          "fill-color": "rgba(238, 66, 244,1)"
        }
      });
      map.setLayoutProperty('parcel-highlights', 'visibility', 'none')
    
      // For marking geocoded results
      map.addSource('single-point', {
        "type": "geojson",
        "data": {
          "type": "FeatureCollection",
          "features": []
        }
      });
      map.addLayer({
        "id": "point",
        "source": "single-point",
        "type": "circle",
        "paint": {
          "circle-radius": 10,
          "circle-color": "#007cbf"
        }
      });
    
      geocoder.on('result', function (ev) {
        map.getSource('single-point').setData(ev.result.geometry);
      });
    
    });
    
    map.on('click', function (e) {
    
      const features = map.queryRenderedFeatures(e.point, {
        layers: ['parcel-highlights']
      });
    
      if (!features.length) {
        return;
      }
    
      features.forEach(function (f) {
        if (f.hasOwnProperty('properties') && f.properties.hasOwnProperty('HANDLE')) {
          // TODO: expand this map item in the Results sidebar
          // toggleResultsItem(f.properties.HANDLE);
        }
      });
    
    });
        
  }
  componentWillUnmount() {
    this.map.remove();
  }
  componentDidUpdate(prevProps) {
    const lastFlyToCoordinates = prevProps.flyToCoordinates;
    if (this.props.flyToCoordinates.timestamp > lastFlyToCoordinates.timestamp) {
      this.map.flyTo({
        center: this.props.flyToCoordinates.coordinates,
        zoom: 20,
      });
    }
  }
  render() {
    return (
      <div id='map'></div>
    );
  }
}
export default connect(mapStateToProps)(Map)
