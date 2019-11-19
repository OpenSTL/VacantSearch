import { connect } from 'react-redux';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import React, { Component } from 'react';
import { collapseAllLots, scrollToLot, setMap, setLotExpanded } from '../actions';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_KEY;

const mapStateToProps = state => {
  return {
    lots: state.filteredLots,
  };
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
    
    map.on('click', (e) => {
    
      const features = map.queryRenderedFeatures(e.point, {
        layers: ['parcel-highlights']
      });
    
      if (!features.length) {
        return;
      }
    
      features.forEach((f) => {
        if (f.hasOwnProperty('properties') && f.properties.hasOwnProperty('HANDLE')) {
          this.props.collapseAllLots();
          const lotId = f.properties.HANDLE;
          this.props.setLotExpanded(lotId, true);
          this.props.scrollToLot(lotId);
        }
      });
    
    });
    this.props.setMap(map);
  }
  componentWillUnmount() {
    this.map.remove();
    this.props.setMap(null);
  }
  componentDidUpdate(prevProps) {
    // TODO: check for lots array to have changed contents before executing the setFilter and related commands
    const { lots } = this.props;
    const map = this.map;
    const layer = 'parcel-highlights';
    if (!lots.length) {
      map.setFilter(layer, ['all', ['match', ['get', 'HANDLE'], ['x'], true, true]]);
      map.setLayoutProperty('parcel-highlights', 'visibility', 'none');
    } else {
      map.setFilter(layer, ['all', ['match', ['get', 'HANDLE'], lots.map(lot => lot._parcel_id), true, false]]);
      map.setLayoutProperty('parcel-highlights', 'visibility', 'visible');
    }
  }
  render() {
    return (
      <div id='map'></div>
    );
  }
}
export default connect(mapStateToProps, {
  collapseAllLots,
  scrollToLot,
  setMap,
  setLotExpanded,
})(Map)
