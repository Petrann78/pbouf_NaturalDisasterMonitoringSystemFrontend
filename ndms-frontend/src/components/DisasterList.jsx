import React, { useEffect, useState } from 'react';
import axios from 'axios';

function DisasterList() {
  const [disasterType, setDisasterType] = useState('earthquake');
  const [data, setData] = useState([]);

  useEffect(() => {
    setData([]);
    const fetchUrl = `${import.meta.env.VITE_API_URL}/api/v1/ndms/${disasterType}s/all`;
    axios.get(fetchUrl)
      .then((response) => {
        const result = response.data;
        if (Array.isArray(result)) {
          setData(result);
        } else {
          console.error("Expected array data but received:", result);
          setData([]);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch data:", error);
        setData([]);
      });
  }, [disasterType]);

  const renderTableHeader = () => {
    switch (disasterType) {
      case 'earthquake':
        return (
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
        );
      case 'flood':
        return (
          <tr>
            <th>Timestamp</th>
            <th>Soil Moisture (%)</th>
            <th>Water Level (m)</th>
            <th>Rainfall (mm)</th>
            <th>Severity</th>
            <th>Velocity</th>
            <th>Flood Type</th>
            <th>Lat</th>
            <th>Lng</th>
          </tr>
        );
      case 'firestorm':
        return (
          <tr>
            <th>Detected At</th>
            <th>Wind Speed (kph)</th>
            <th>Wind Dir (°)</th>
            <th>Temperature (°C)</th>
            <th>Spread Rate (kph)</th>
            <th>Altitude</th>
            <th>Size (km²)</th>
            <th>Intensity</th>
            <th>Description</th>
            <th>Lat</th>
            <th>Lng</th>
          </tr>
        );
      default:
        return null;
    }
  };

  const renderTableRows = () => {
    return data.map((item, idx) => {
      switch (disasterType) {
        case 'earthquake':
          return (
            <tr key={idx}>
              <td>{new Date(item.timestamp).toLocaleString()}</td>
              <td>{item.richter_magnitude}</td>
              <td>{item.moment_magnitude}</td>
              <td>{item.energy_release} J</td>
              <td>{item.intensity}</td>
              <td>{item.epicenter?.latitude ?? 'N/A'}</td>
              <td>{item.epicenter?.longitude ?? 'N/A'}</td>
              <td>{item.depth_km}</td>
              <td>{item.damage_level}</td>
              <td>{item.soil_type}</td>
              <td>{item.infra_damage?.roads ?? 'N/A'}</td>
              <td>{item.infra_damage?.bridges ?? 'N/A'}</td>
              <td>{item.infra_damage?.buildings ?? 'N/A'}</td>
            </tr>
          );
        case 'flood':
          return (
            <tr key={idx}>
              <td>{new Date(item.timestamp).toLocaleString()}</td>
              <td>{item.soil_moisture_percent}</td>
              <td>{item.water_level_m}</td>
              <td>{item.rainfall_mm}</td>
              <td>{item.severity_level}</td>
              <td>{item.current_velocity}</td>
              <td>{item.flood_type}</td>
              <td>{item.location?.latitude ?? 'N/A'}</td>
              <td>{item.location?.longitude ?? 'N/A'}</td>
            </tr>
          );
        case 'firestorm':
          return (
            <tr key={idx}>
              <td>{new Date(item.detected_at).toLocaleString()}</td>
              <td>{item.wind_speed_kph}</td>
              <td>{item.wind_direction_deg}</td>
              <td>{item.temperature_celsius}</td>
              <td>{item.spread_rate_kph}</td>
              <td>{item.altitude}</td>
              <td>{item.size_in_square_km}</td>
              <td>{item.intensity}</td>
              <td>{item.description}</td>
             <td>{item.location?.latitude ?? 'N/A'}</td>
             <td>{item.location?.longitude ?? 'N/A'}</td>
            </tr>
          );
        default:
          return null;
      }
    });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Disaster Monitoring Dashboard</h2>
      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => setDisasterType('earthquake')}>Earthquakes</button>
        <button onClick={() => setDisasterType('flood')}>Floods</button>
        <button onClick={() => setDisasterType('firestorm')}>Firestorms</button>
      </div>

      <table border="1" cellPadding="10" cellSpacing="0" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          {renderTableHeader()}
        </thead>
        <tbody>
          {renderTableRows()}
        </tbody>
      </table>
    </div>
  );
}

export default DisasterList;
