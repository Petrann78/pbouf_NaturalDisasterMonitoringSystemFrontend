import React, { useEffect, useState } from 'react';
import axios from 'axios';

function EarthquakeList() {
  const [earthquakes, setEarthquakes] = useState([]);

 useEffect(() => {
   axios.get(`${import.meta.env.VITE_API_URL}/api/v1/ndms/earthquakes/all`)
     .then((response) => {
       const data = response.data;
       console.log("Received earthquake data:", data);
       if (Array.isArray(data)) {
         setEarthquakes(data);
       } else {
         console.error("Expected an array but got:", data);
         setEarthquakes([]); // fallback
       }
     })
     .catch((error) => {
       console.error("API call failed:", error);
     });
 }, []);


  return (
    <div style={{ padding: '20px' }}>
      <h2>Recorded Earthquakes</h2>
      <table border="1" cellPadding="10" cellSpacing="0" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Richter</th>
            <th>Moment</th>
            <th>Energy</th>
            <th>Intensity</th>
            <th>Lat</th>
            <th>Lng</th>
            <th>Depth (km)</th>
            <th>Damage</th>
            <th>Soil</th>
            <th>Roads</th>
            <th>Bridges</th>
            <th>Buildings</th>
          </tr>
        </thead>
        <tbody>
          {earthquakes.map((eq) => (
            <tr key={eq.id}>
              <td>{new Date(eq.timestamp).toLocaleString()}</td>
              <td>{eq.richter_magnitude}</td>
              <td>{eq.moment_magnitude}</td>
              <td>{eq.energy_release.toExponential()} J</td>
              <td>{eq.intensity}</td>
              <td>{eq.epicenter.latitude}</td>
              <td>{eq.epicenter.longitude}</td>
              <td>{eq.depth_km}</td>
              <td>{eq.damage_level}</td>
              <td>{eq.soil_type}</td>
              <td>{eq.infra_damage.roads}</td>
              <td>{eq.infra_damage.bridges}</td>
              <td>{eq.infra_damage.buildings}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EarthquakeList;
