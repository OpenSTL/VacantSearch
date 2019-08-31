mapboxgl.accessToken = 'pk.eyJ1IjoibXJhbzIiLCJhIjoiY2ppZmFoazE5MGZiMjNwcXBtb3gyenk4cyJ9.nmFZofR-kOqj8yYfaJc2XQ';
const map = new mapboxgl.Map({
  container: 'map', // container id
  style: 'mapbox://styles/mrao2/cjzuiuexr09mn1crs8tz35s3k', // stylesheet location
  center: [-90.199402, 38.627003], // starting position [lng, lat]
  zoom: 12 // starting zoom
});

const geocoder = new MapboxGeocoder({
  accessToken: mapboxgl.accessToken,

  // limit results to Australia
  country: 'us',

  // further limit results to the geographic bounds representing the region of
  bbox: [-90.55234, 38.383975, -90.13074, 39.046325],

});
// add geocoder to DOM
document.getElementById('geocoder').appendChild(geocoder.onAdd(map));

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

function highLightParcels(layer, handles) {
  if (!Array.isArray(handles)) {
    handles = [];
  }

  if (!handles.length) {
    map.setFilter(layer, ['all', ['match', ['get', 'HANDLE'], ['x'], true, true]]);
    map.setLayoutProperty('parcel-highlights', 'visibility', 'none');
  } else {
    map.setFilter(layer, ['all', ['match', ['get', 'HANDLE'], handles, true, false]]);

    map.setLayoutProperty('parcel-highlights', 'visibility', 'visible');
  }
}