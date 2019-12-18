import MapContainer from './map/MapContainer';
import React from 'react';
import Sidebar from './sidebar/Sidebar';
import SidebarContent from './sidebar/SidebarContent';

function App() {
  return (
    <div className="App">
      <MapContainer />
      <Sidebar>
        <SidebarContent />
      </Sidebar>
    </div>
  );
}

export default App;
