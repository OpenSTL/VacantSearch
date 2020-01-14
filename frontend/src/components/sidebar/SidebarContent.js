import * as tabs from '../../constants/tabs';
import classNames from 'classnames';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import ResultsTab from './ResultsTab';
import SearchForm from './SearchForm';
import { setSelectedTab } from '../../actions';
import { getSelectedTab } from '../../selectors';
import TabContent from './TabContent';

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
        <div className="tab-contents">
          <TabContent
            className='tab-content-search'
            tabActive={this.props.selectedTab === tabs.SEARCH}
          >
            <SearchForm />
          </TabContent>
          <TabContent
            className='tab-content-results'
            tabActive={this.props.selectedTab === tabs.RESULTS}
          >
            <ResultsTab />
          </TabContent>
        </div>
      </section>
    );
  }
}
export default connect(mapStateToProps, { setSelectedTab })(SidebarContent);
