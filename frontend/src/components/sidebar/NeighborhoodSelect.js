import React from 'react';
import neighborhoods from '../../assets/data/neighborhoods.json';

function NeighborhoodSelect() {
  return (
    <select id="form-neighborhood" name="form-neighborhood">
      <option value='0'>All Neighborhoods</option>
      {neighborhoods.map((neighborhood, index) => (
        <option key={index} value={neighborhood.id}>
          {neighborhood.name}
        </option>
      ))}
    </select>
  );
}
export default NeighborhoodSelect;
