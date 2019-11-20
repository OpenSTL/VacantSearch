import { connect } from 'react-redux';
import React, { Component } from 'react';

import { getFilteredLots } from '../../selectors'
import Result from './Result';

const mapStateToProps = state => {
  return { results: getFilteredLots(state) };
};

class ConnectedResultsList extends Component {
  render() {
    return (
      <>
        {this.props.results.map((result, index) => (
          <Result key={index} resultItem={result} />
        ))}
        {this.props.results.length === 0 && <p>No matching results. Please try another search</p>}
      </>
    );
  }
}

const ResultsList = connect(mapStateToProps)(ConnectedResultsList);

export default ResultsList;
