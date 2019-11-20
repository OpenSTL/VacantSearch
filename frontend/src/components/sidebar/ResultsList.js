import { connect } from 'react-redux';
import React, { Component } from 'react';

import { getFilteredLots } from '../../selectors'
import { scrollableArea } from 'react-redux-scroll';

import Result from './Result';
import ScrollableResult from './ScrollableResult';

const mapStateToProps = state => {
  return { results: getFilteredLots(state) };
};

const ScrollableList = scrollableArea('div');

class ResultsList extends Component {
  render() {
    return (
      <ScrollableList className="results-container noscroll">
        {this.props.results.map((result, index) => (
          <ScrollableResult
            key={index}
            id={result._parcel_id}
          >
            <Result resultItem={result} />
          </ScrollableResult>
        ))}
        {this.props.results.length === 0 && <p>No matching results. Please try another search</p>}
      </ScrollableList>
    );
  }
}

export default connect(mapStateToProps)(ResultsList);
