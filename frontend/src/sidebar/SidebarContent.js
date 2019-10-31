import classNames from 'classnames';
import React, { Component } from 'react';
import SearchForm from './SearchForm';

class SidebarContent extends Component {
    constructor() {
      super();
      this.state = {
        activeTab: 'search',
      };
    }
    render() {
        return (
            <section className="sidebar-section">
            {/* Tab Headers */}
            <div className="tab-row">
              <div
                className={classNames('tab', 'tab-search', { 'tab-active': this.state.activeTab === 'search'})}
                onClick={() => this.setTabActive('search')}
              >
                <span className="tab-search">
                  <i className="fa fa-search"></i>
                  Search
                </span>
              </div>
              <div
                className={classNames('tab', 'tab-results', { 'tab-active': this.state.activeTab === 'results'})}
                onClick={() => this.setTabActive('results')}
              >
                <span className="tab-results">
                  <i className="fa fa-list"></i>
                  Results
                </span>
              </div>
            </div>
            {/* Tabbed Sections */}
            <div className="sidebar-tab-content">
              {/* Tab 1: Search Form */}
              <div className={classNames('tab-content', 'tab-content-search', { 'tab-active': this.state.activeTab === 'search'})}>
                <SearchForm />
              </div>
              {/* Tab 2: Results ListView */}
              <div className={classNames('tab-content', 'tab-content-results', { 'tab-active': this.state.activeTab === 'results'})}>
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
        );
    }
    setTabActive(tab) {
      if (!['results', 'search'].includes(tab)) throw new Error(`unknown tab ${tab}`);
      this.setState({
        activeTab: tab,
      });
    }
}
export default SidebarContent;
