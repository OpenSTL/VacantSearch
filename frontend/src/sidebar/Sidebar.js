import classNames from 'classnames';
import React, { Component } from 'react';
import NeighborhoodSelect from './NeighborhoodSelect';

class Sidebar extends Component {
    constructor() {
        super();
        this.state = {
            active: true,
        };
    }
    onClickToggleButton() {
        this.setState((state) => ({
            active: !state.active,
        }));
    }
    render() {
        const sidebarClassNames = classNames('sidebar', { active: this.state.active });
        const toggleButtonClassNames = classNames('toggle-btn', { active: this.state.active });
        const toggleIconClassNames = classNames('fa', {
            'fa-chevron-right': !this.state.active,
            'fa-chevron-left': this.state.active,
        });
        return (
            <div className="sidebar-container">
              <div className={sidebarClassNames} id="sidebar">
                <div 
                    className={toggleButtonClassNames}
                    onClick={() => this.onClickToggleButton()}
                >
                  <i className={toggleIconClassNames} id="toggle-icon"></i>
                </div>
                {/*Top Sidebar Header*/}
                <header className="sidebar-section sidebar-header">
                  <h1 className="heading_brand-name">OpenSTL</h1>
                  <p>Search for vacant houses in St. Louis</p>
                  <div className="geocoder" id="geocoder"></div>
                </header>
                <br />
                <section className="sidebar-section">
                  {/* Tab Headers */}
                  <div className="tab-row">
                    <div className="tab tab-search tab-active">
                      <span className="tab-search">
                        <i className="fa fa-search"></i>
                        Search
                      </span>
                    </div>
                    <div className="tab tab-results">
                      <span className="tab-results">
                        <i className="fa fa-list"></i>
                        Results
                      </span>
                    </div>
                  </div>
                  {/* Tabbed Sections */}
                  <div className="sidebar-tab-content">
                    {/* Tab 1: Search Form */}
                    <div className="tab-content tab-content-search tab-active">
                      <form action="post" id="sidebar-form">
                        <fieldset className="form-fieldset">
                          <label htmlFor="form-price-min" className="form-section">
                            Price
                            <div className="input-container">
                              <div><span className="subtext">min </span><input type="number"
                                  name="form-price-min" id="form-price-min"
                                  min="0" defaultValue="80000"
                                  max="10000000" step="10000" /></div>
                              <div><span className="subtext">max </span><input type="number"
                                  name="form-price-max" id="form-price-max"
                                  min="0" defaultValue="250000"
                                  max="10000000" step="10000" /></div>
                            </div>
                          </label>
                          <label htmlFor="form-acres-min" className="form-section">
                            Sq Ft
                            <div className="input-container">
                              <div><span className="subtext">min </span><input type="number"
                                  name="form-acres-min"
                                  id="form-acres-min"
                                  min="200" defaultValue="1200"
                                  max="20000" step="100" /></div>
                              <div><span className="subtext">max </span><input type="number"
                                  name="form-acres-max"
                                  id="form-acres-max"
                                  min="200" defaultValue="2300"
                                  max="20000" step="100" /></div>
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
                                {/* autofill? */}
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
                                {/* autofill? */}
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
                      <div id="sidebar-form-search-in-progress" className="invisible">
                        <div className="linear-progress-container">
                          <div className="indeterminate-progress"></div>
                        </div>
                        <p>Searching...</p>
                      </div>
                    </div>
                    {/* Tab 2: Results ListView */}
                    <div className="tab-content tab-content-results">
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
                      <div className="results-container noscroll" id="results-container">
                        {/* Default message */}
                        <p>No matching results. Please try another search</p>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
        );
    }
}
export default Sidebar;
