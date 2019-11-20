import classNames from 'classnames';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import NeighborhoodSelect from './NeighborhoodSelect';
import { fetchFilteredLots } from '../../actions';
import { getSearching } from '../../selectors';

class SearchForm extends Component {
  onFormSubmit(event) {
    event.preventDefault();

    const { fetchFilteredLots } = this.props;

    // Get data from form
    const sidebarForm = document.getElementById('sidebar-form');
    const formData = new FormData(sidebarForm);
    const priceMin = formData.get('form-price-min');
    const priceMax = formData.get('form-price-max');
    const sqFtMin = formData.get('form-acres-min');
    const sqFtMax = formData.get('form-acres-max');
    const neighborhoods = [
      parseInt(formData.get('form-neighborhood')),
    ];
    const minBaths = formData.get('form-baths-min');
    const maxBaths = formData.get('form-baths-max');

    // Format api request
    const requestData = {
      "IncludePossible": true,
      "LotType": 3,  // 1 vacant lot, 2 vacant building, 3 both
      "Neighborhoods": neighborhoods,
      "NumBathsMax": maxBaths,
      "NumBathsMin": minBaths,
      "PriceMax": priceMax,
      "PriceMin": priceMin,
      "SqFtMin": sqFtMin,
      "SqFtMax": sqFtMax,
    };

    // Make the request
    fetchFilteredLots(requestData);
  }

  render() {
    let { searching } = this.props;

    const sidebarFormCx = classNames({
      'invisible': searching,
    });
    const searchInProgressCx = classNames({
      'invisible': !searching,
    });

    return (
      <>
        <form 
          action="post"
          className={sidebarFormCx}
          id="sidebar-form"
          onSubmit={(e) => this.onFormSubmit(e)}
        >
          <fieldset className="form-fieldset">
            <label htmlFor="form-price-min" className="form-section">
              Price
              <div className="input-container">
                <div><span className="subtext">min </span><input type="number"
                    name="form-price-min" id="form-price-min"
                    min="0" defaultValue="0"
                    max="10000000" step="10000" 
                    disabled />
                </div>
                <div><span className="subtext">max </span><input type="number"
                    name="form-price-max" id="form-price-max"
                    min="0" defaultValue="40000"
                    max="10000000" step="10000" 
                    disabled />
                </div>
              </div>
            </label>
            <label htmlFor="form-acres-min" className="form-section">
              Sq Ft
              <div className="input-container">
                <div><span className="subtext">min </span><input type="number"
                    name="form-acres-min"
                    id="form-acres-min"
                    min="10" defaultValue="1200"
                    max="20000" step="1" /></div>
                <div><span className="subtext">max </span><input type="number"
                    name="form-acres-max"
                    id="form-acres-max"
                    min="10" defaultValue="2300"
                    max="2000000" step="1" /></div>
              </div>
            </label>
            <label htmlFor="form-neighborhood" className="form-section
              form-section-neighborhood">
              Neighborhood
              <NeighborhoodSelect />
            </label>
            <label htmlFor="form-baths-min" className="form-section">
              Baths
              <div>
                <select name="form-baths-min" id="form-baths-min"
                  className="form-baths"
                  min="0" max="6" step="0.5"
                  defaultValue={'1'}
                >
                  <option>.5</option>
                  <option>1</option>
                  <option>1.5</option>
                  <option>2</option>
                  <option>2.5</option>
                  <option>3</option>
                  <option>3.5</option>
                  <option>4</option>
                  <option>4.5</option>
                  <option>5</option>
                  <option>5.5</option>
                  <option>6</option>
                </select>
                -
                <select name="form-baths-max" id="form-baths-max"
                  className="form-baths"
                  min="0" max="6" step="0.5"
                  defaultValue={'2.5'}
                >
                  <option>.5</option>
                  <option>1</option>
                  <option>1.5</option>
                  <option>2</option>
                  <option>2.5</option>
                  <option>3</option>
                  <option>3.5</option>
                  <option>4</option>
                  <option>4.5</option>
                  <option>5</option>
                  <option>5.5</option>
                  <option>6</option>
                </select>
              </div>
            </label>
          </fieldset>
          <input type="submit" value="Search" className="form-submit-btn" />
        </form>
        {/* search in progress */}
        <div
          id="sidebar-form-search-in-progress"
          className={searchInProgressCx}
        >
          <div className="linear-progress-container">
            <div className="indeterminate-progress"></div>
          </div>
          <p>Searching...</p>
        </div>
      </>
    );
  }
}

const mapStateToProps = state => ({
  searching: getSearching(state)
})

const ConnectedSearchForm = connect(
  mapStateToProps,
  { fetchFilteredLots }
)(SearchForm);

export default ConnectedSearchForm;
