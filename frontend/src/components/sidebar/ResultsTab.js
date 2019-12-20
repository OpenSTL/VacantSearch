import React, { Component } from 'react';
import ResultsList from './ResultsList';

class ResultsTab extends Component {
  render() {
    return (
      <>
        <ResultsList />
        <div className="results-legend">
          <div className="icon-key">
            <i className="fa fa-building"></i>
            Building
          </div>
          <div className="icon-key">
            <i className="fa fa-seedling"></i>
            Lot
          </div>
          <div className="icon-key">
            <i className="fa fa-question"></i>
            Possible
          </div>
        </div>
      </>
    );
  }
}
export default ResultsTab;