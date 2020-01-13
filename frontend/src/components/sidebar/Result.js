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

/**
 * Function to convert int or bool to 'Yes' or 'No' string
 * @param {bool/int} value to be converted
 * @return {string} 'Yes' or 'No'
 */
function makeYesOrNo(value){
  return (value ? 'Yes':'No');
}

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
    // details:
    const { resultItem } = this.props;
    const hasAttic = makeYesOrNo(resultItem.attic);
    const hasFinishedBasement = makeYesOrNo(resultItem.basement_finished);
    const basementType = resultItem.basement_type;
    const buildingType = resultItem.bldg_type;
    const hasCentralHeat = makeYesOrNo(resultItem.central_heat);
    const hasGarage = makeYesOrNo(resultItem.garage);
    const neighborhoodName = resultItem.nbrhd_name;
    const numStories = resultItem.num_stories;
    const wallMaterial = resultItem.wall_material;
    // top right info items:
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
            <li>Finished Basement: {hasFinishedBasement}</li>
            <li>Heating: {hasCentralHeat}</li>
            <li>Garage: {hasGarage} </li>
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
