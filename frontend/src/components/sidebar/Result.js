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
    const acres = resultItem.acres;
    const basementType = resultItem.basement_type;
    const buildingType = resultItem.bldg_type;
    const centralHeat = resultItem.central_heat;
    const id = resultItem._parcel_id;
    const neighborhoodCode = resultItem.nbrhd_code;
    const neighborhoodName = resultItem.nbrhd_name;
    const wallMaterial = resultItem.wall_material;
    // top right info items
    const price = resultItem.price_residential;
    const sqFt = Math.floor(resultItem.size_sqFt);
    const baths = resultItem.bath_total;

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
          <ul>
            <li>id: {id}</li>
            <li>nbCode: {neighborhoodCode}</li>
            <li>acres: {acres}</li>
            <li>building: {buildingType}</li>
            <li>walls: {wallMaterial}</li>
            <li>basement: {basementType}</li>
            <li>heating: {centralHeat}</li>
          </ul>
        </div>
        <div className="results-item-stats">
          <span>{'$' + price}</span>
          <span>{baths + ' Bath'}</span>
          <span>{sqFt + 'SF'}</span>
        </div>
      </div>
    );
  }
}
export default connect(mapStateToProps, { setLotExpanded })(Result);
