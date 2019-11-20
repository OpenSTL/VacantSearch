import React, { Component } from 'react';
import ResultsList from './ResultsList';

class ResultsTab extends Component {
  render() {
    return (
      <>
        <header className="results-header">
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
        </header>
        <ResultsList />  
      </>
    );
  }
}
export default ResultsTab;