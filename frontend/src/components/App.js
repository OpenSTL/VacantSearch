import React from 'react';
import Map from './Map';
import Sidebar from './sidebar/Sidebar';
import SidebarContent from './sidebar/SidebarContent';

function App() {
  return (
    <div className="App">
      <Map />
      <Sidebar>
        <SidebarContent />
      </Sidebar>
    </div>
  );
}

export default App;
