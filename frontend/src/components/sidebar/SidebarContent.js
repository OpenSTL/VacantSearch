import * as tabs from '../../constants/tabs';
import classNames from 'classnames';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import ResultsTab from './ResultsTab';
import SearchForm from './SearchForm';
import { setSelectedTab } from '../../actions';
import { getSelectedTab } from '../../selectors';

const mapStateToProps = state => {
  return { selectedTab: getSelectedTab(state) };
};

class SidebarContent extends Component {
  render() {
    return (
      <section className="sidebar-section">
        {/* Tab Headers */}
        <div className="tab-row">
          <div
            className={classNames('tab', 'tab-search', { 'tab-active': this.props.selectedTab === tabs.SEARCH})}
            onClick={() => this.props.setSelectedTab(tabs.SEARCH)}
          >
            <span className="tab-search">
              <i className="fa fa-search"></i>
              Search
            </span>
          </div>
          <div
            className={classNames('tab', 'tab-results', { 'tab-active': this.props.selectedTab === tabs.RESULTS})}
            onClick={() => this.props.setSelectedTab(tabs.RESULTS)}
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
          <div className={classNames('tab-content', 'tab-content-search', { 'tab-active': this.props.selectedTab === tabs.SEARCH})}>
            <SearchForm />
          </div>
          {/* Tab 2: Results ListView */}
          <div className={classNames('tab-content', 'tab-content-results', { 'tab-active': this.props.selectedTab === tabs.RESULTS})}>
            <ResultsTab />
          </div>
        </div>
      </section>
    );
  }
}
export default connect(mapStateToProps, { setSelectedTab })(SidebarContent);
