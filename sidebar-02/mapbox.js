mapboxgl.accessToken = 'pk.eyJ1IjoibXJhbzIiLCJhIjoiY2ppZmFoazE5MGZiMjNwcXBtb3gyenk4cyJ9.nmFZofR-kOqj8yYfaJc2XQ';
var map = new mapboxgl.Map({
  container: 'map', // container id
  style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
  center: [-90.199402, 38.627003], // starting position [lng, lat]
  zoom: 12 // starting zoom
});

var geocoder = new MapboxGeocoder({
  accessToken: mapboxgl.accessToken,

  // limit results to Australia
  country: 'us',

  // further limit results to the geographic bounds representing the region of
  bbox: [-90.55234, 38.383975, -90.13074, 39.046325],

});

map.addControl(geocoder);

map.on('load', function () {

  map.addSource('parcels', {
    "type": "vector",
    "url": "mapbox://mrao2.1h90kw7u"
  });

  map.addLayer({
    "id": "all-parcels",
    "type": "fill",
    "source": "parcels",
    "source-layer": "parcels-3swwt3",
    "paint": {
      "fill-outline-color": "rgba(238, 66, 244,1)",
      "fill-color": "rgba(238, 66, 244,1)"
    }
  });

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