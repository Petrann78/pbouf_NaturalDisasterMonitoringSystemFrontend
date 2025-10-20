import { useEffect, useState } from 'react';
import axios from 'axios';
import earthquakeImage from '../assets/earthquake.jpg';
import floodImage from '../assets/flood.jpg';
import firestormImage from '../assets/firestorm.jpg';
import * as Tabs from '@radix-ui/react-tabs';
import * as Separator from '@radix-ui/react-separator';
import { Button } from '@radix-ui/themes';

function DisasterList() {
  const [disasterType, setDisasterType] = useState('earthquake');
  const [data, setData] = useState([]);

  const [filters, setFilters] = useState({
    earthquake: {
      richter_magnitude: '',
      moment_magnitude: '',
      energy_release: '',
      intensity: '',
      depth_km: '',
      damage_level: '',
      soil_type: '',
    },
    flood: {
      soil_moisture_percent: '',
      water_level_m: '',
      severity_level: '',
      rainfall_mm: '',
      current_velocity: '',
      flood_type: '',
      latitude: '',
      longitude: '',
    },
    firestorm: {
      wind_speed_kph: '',
      intensity: '',
      description: '',
      temperature_celsius: '',
      spread_rate_kph: '',
      altitude: '',
      size_in_square_km: '',
    }
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [disasterType]: {
        ...prev[disasterType],
        [name]: value,
      }
    }));
  };

  useEffect(() => {
    fetchData();
  }, [disasterType]);

  const getDisasterImage = () => {
    switch (disasterType) {
      case 'earthquake':
        return earthquakeImage;
      case 'flood':
        return floodImage;
      case 'firestorm':
        return firestormImage;
      default:
        return '';
    }
  };

  const fetchData = () => {
    setData([]);

    //let fetchUrl = `${import.meta.env.VITE_API_URL}/api/v1/ndms/${disasterType}s`;

    const fetchUrlBase = `${import.meta.env.VITE_API_URL}/api/v1/ndms/${disasterType}s/filter`;

    const params = new URLSearchParams();
    Object.entries(filters[disasterType]).forEach(([key, value]) => {
      if (value !== '') {
        params.append(key, value);
      }
    });

    const fetchUrl = `${fetchUrlBase}?${params.toString()}`;

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
  };

  const renderTableHeader = () => {
    switch (disasterType) {
      case 'earthquake':
        return ['Timestamp', 'Richter', 'Moment', 'Energy', 'Intensity', 'Lat', 'Lng', 'Depth (km)', 'Damage', 'Soil', 'Roads', 'Bridges', 'Buildings'];
      case 'flood':
        return ['Timestamp', 'Soil Moisture (%)', 'Water Level (m)', 'Rainfall (mm)', 'Severity', 'Velocity', 'Flood Type', 'Lat', 'Lng'];
      case 'firestorm':
        return ['Detected At', 'Wind Speed (kph)', 'Wind Dir (°)', 'Temperature (°C)', 'Spread Rate (kph)', 'Altitude', 'Size (km²)', 'Intensity', 'Description', 'Lat', 'Lng'];
      default:
        return [];
    }
  };

  const renderTableRows = () => {
    return data.map((item, idx) => {
      switch (disasterType) {
        case 'earthquake':
          return (
            <tr key={idx} className="hover:bg-gray-100 transition">
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
            <tr key={idx} className="hover:bg-gray-100 transition">
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
            <tr key={idx} className="hover:bg-gray-100 transition">
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
    <div className="w-full">
      {/* Banner */}
      <div className="relative w-full h-[250px] overflow-hidden">
        <img src={getDisasterImage()} alt={`${disasterType} banner`} className="w-full h-full object-cover" />
        <h1 className="absolute top-1/2 left-1/2 text-white text-4xl font-bold drop-shadow-xl -translate-x-1/2 -translate-y-1/2">
          {disasterType.charAt(0).toUpperCase() + disasterType.slice(1)}s
        </h1>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Disaster Monitoring Dashboard</h2>

        {/* Tabs */}
        <Tabs.Root value={disasterType} onValueChange={setDisasterType}>
          <Tabs.List className="flex gap-3 border-b border-gray-200 mb-6">
            {['earthquake', 'flood', 'firestorm'].map((type) => (
              <Tabs.Trigger
                key={type}
                value={type}
                className={`px-4 py-2 rounded-t-md text-sm font-medium transition ${disasterType === type
                  ? 'bg-blue-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}s
              </Tabs.Trigger>
            ))}
          </Tabs.List>
        </Tabs.Root>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-4">
          {Object.entries(filters[disasterType]).map(([key, value]) => (
            <input
              key={key}
              type="text"
              name={key}
              placeholder={key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
              value={value}
              onChange={handleFilterChange}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          ))}
          <button
            onClick={fetchData}
            className="px-4 py-2 bg-blue-600 text-sm rounded-md hover:bg-blue-700 transition"
          >
            Apply Filters
          </button>
        </div>

        <Separator.Root className="my-6 h-[1px] bg-gray-300" />

        {/* Table */}
        {
          data.length <= 0 ? (
            <div>No data found</div>
          ) : (
            <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
              <table className="min-w-full text-sm text-left border-collapse">
                <thead className="bg-gray-100">
                  <tr>
                    {renderTableHeader().map((head, i) => (
                      <th key={i} className="px-4 py-2 font-semibold text-gray-700 border-b">
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">{renderTableRows()}</tbody>
              </table>
            </div>
          )
        }

      </div>
    </div>
  );
}

export default DisasterList;