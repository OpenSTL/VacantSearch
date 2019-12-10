import classNames from 'classnames';
import React, { Component } from 'react';

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
          {/*Sidebar Toggle Button*/}
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
          {this.props.children}
        </div>
      </div>
    );
  }
}
export default Sidebar;
