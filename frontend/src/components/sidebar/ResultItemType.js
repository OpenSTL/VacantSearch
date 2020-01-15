/**
 * @typedef ResultItem
 * this is a partial definition of individual API results
 * included here are all all fields currently used by the UI
 * booleans here are actually numbers with 0 or 1
 * listed as boolean for ease of reading
 * @property {string} _parcel_id
 * @property {boolean} attic
 * @property {string} basement_finished 'finished' / 'unfinished'
 * @property {string} basement_type 'full basement' / 'foundation' / 'partial-basement' / potentially more
 * @property {number} bath_total ex. 2.0 or 0.5
 * @property {string} bldg_type 'single family' / 'two family' / 'three family' / potentially more
 * @property {number} central_heat
 * @property {boolean} garage
 * @property {string} lot_type
 * @property {string} nbrhd_name Neighborhood name
 * @property {number} num_stories
 * @property {string} parcel_geojson Valid GeoJSON defining the property boundaries.
 * @property {number} price_residential
 * @property {number} size_sqFt
 * @property {string} street_addr Just the street. Nothing but the street.
 * @property {string} wall_material
 * @property {number} zip
 */