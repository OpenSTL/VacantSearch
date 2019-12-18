import React, { Component } from 'react';

class MapTopToolbar extends Component {
  render() {
    return (
      <div className='map-top-toolbar'>
        {this.props.children}
      </div>
    );
  }
}
export default MapTopToolbar;
