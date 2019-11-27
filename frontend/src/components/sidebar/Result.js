import classNames from 'classnames';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import ResultItemIconSet from './ResultItemIconSet';
import { getMap } from '../../selectors';
import {
  setLotExpanded,
} from '../../actions';

function getFlyToPointForLot(lot) {
  const points = JSON.parse(lot.parcel_geojson)[0];
  const point = points[0];
  const corner = point[0];
  return corner;
}

const mapStateToProps = state => {
  return {
    map: getMap(state),
  };
};

// prop: resultItem
class Result extends Component {
  onClick() {
    const { resultItem } = this.props;
    if (!resultItem.expanded) {
      this.props.map.flyTo({
        center: getFlyToPointForLot(resultItem),
        zoom: 20,
      });
    }
    this.props.setLotExpanded(resultItem._parcel_id, !resultItem.expanded);
  }
  render() {
    // details
    const { resultItem } = this.props;
    // const acres = resultItem.acres;
    const hasAttic = resultItem.attic;
    const finishedBasement = resultItem.basement_finished;
    const basementType = resultItem.basement_type;
    // const numFullBath = resultItem.bath_full;
    // const numHalfBath = resultItem.bath_half;
    const buildingType = resultItem.bldg_type;
    const centralHeat = resultItem.central_heat;
    // const gndFlrSqFt = resultItem.com_grd_flr;
    const construction = resultItem.construction;
    const hasGarage = resultItem.garage;
    // const id = resultItem._parcel_id;
    // const neighborhoodCode = resultItem.nbrhd_code;
    const neighborhoodName = resultItem.nbrhd_name;
    const numStories = resultItem.num_stories;
    const wallMaterial = resultItem.wall_material;
    // top right info items
    const price = resultItem.price_residential;
    const sqFt = Math.floor(resultItem.size_sqFt);
    const baths = resultItem.bath_total;
    const streetAddr = resultItem.street_addr;
    const zip = resultItem.zip;

    const resultsItemCx = classNames('results-item', {
      'result-open': resultItem.expanded,
    });

    return (
      <div
        className={resultsItemCx}
        onClick={() => this.onClick()}
      >
        <div className="results-item-icon-container">
          <ResultItemIconSet resultItem={resultItem} />
        </div>
        <div className="results-item-details">
          <h3>
            <span>{neighborhoodName}</span>
          </h3>
          <h4>
            <span>{streetAddr}, ST.LOUIS, {zip}</span>
          </h4>
          <ul>
            <li> {buildingType} | {numStories} </li>
            <li>Walls: {wallMaterial}</li>
            <li>Basement: {basementType}</li>
            <li>Construction: {construction}</li>
            <li>Finished Basement: {finishedBasement}</li>
            <li>Heating: {centralHeat}</li>
            <li>Garage: {hasGarage}</li>
            <li>Attic: {hasAttic}</li>
          </ul>
        </div>
        <div className="results-item-stats">
          <span>{'$' + price}</span>
          <span>{baths + ' Bath'}</span>
          <span>{sqFt + ' sqFt'}</span>
        </div>
      </div>
    );
  }
}
export default connect(mapStateToProps, { setLotExpanded })(Result);
