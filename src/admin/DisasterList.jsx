import React, { useEffect, useState } from "react";
import axios from "axios";
import earthquakeImage from "../assets/earthquake.jpg";
import floodImage from "../assets/flood.jpg";
import firestormImage from "../assets/firestorm.jpg";

function DisasterList() {
  const [disasterType, setDisasterType] = useState("earthquake");
  const [data, setData] = useState([]);
  const [editRow, setEditRow] = useState(null);
  const [editedData, setEditedData] = useState({});

  // ---------------------------------
  // 🔧 Fetch Data
  // ---------------------------------
  const fetchData = () => {
    setData([]);

    const fetchUrlBase = `${import.meta.env.VITE_API_URL}/api/v1/ndms/${disasterType}s/filter`;

    const params = new URLSearchParams();
    Object.entries(filters[disasterType]).forEach(([key, value]) => {
      if (value !== "") params.append(key, value);
    });

    const fetchUrl = `${fetchUrlBase}?${params.toString()}`;

    axios
      .get(fetchUrl)
      .then((response) => {
        const result = response.data;
        if (Array.isArray(result)) setData(result);
        else setData([]);
      })
      .catch((error) => {
        console.error("Failed to fetch data:", error);
        setData([]);
      });
  };

  // ---------------------------------
  // ✏️ Edit & Save Handlers
  // ---------------------------------
  const startEditing = (item) => {
    // backend might return earthquake_id instead of id
    const rowId = item.id || item.earthquake_id || item.flood_id || item.firestorm_id;
    setEditRow(rowId);
    setEditedData(item);
  };

  const handleSave = async (id) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/v1/ndms/earthquakes/alter/${id}`,
        editedData
      );
      alert("✅ Update successful!");
      setEditRow(null);
      fetchData();
    } catch (error) {
      console.error("❌ Failed to update earthquake:", error);
      alert("Update failed!");
    }
  };

  // ---------------------------------
  // ⚙️ Filters
  // ---------------------------------
  const [filters, setFilters] = useState({
    earthquake: {
      richter_magnitude: "",
      moment_magnitude: "",
      energy_release: "",
      intensity: "",
      depth_km: "",
      damage_level: "",
      soil_type: "",
    },
    flood: {
      soil_moisture_percent: "",
      water_level_m: "",
      severity_level: "",
      rainfall_mm: "",
      current_velocity: "",
      flood_type: "",
      latitude: "",
      longitude: "",
    },
    firestorm: {
      wind_speed_kph: "",
      intensity: "",
      description: "",
      temperature_celsius: "",
      spread_rate_kph: "",
      altitude: "",
      size_in_square_km: "",
    },
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [disasterType]: {
        ...prev[disasterType],
        [name]: value,
      },
    }));
  };

  // ---------------------------------
  // 🖼️ Header Image
  // ---------------------------------
  const getDisasterImage = () => {
    switch (disasterType) {
      case "earthquake":
        return earthquakeImage;
      case "flood":
        return floodImage;
      case "firestorm":
        return firestormImage;
      default:
        return "";
    }
  };

  useEffect(() => {
    fetchData();
  }, [disasterType]);

  // ---------------------------------
  // 🧱 Render Table
  // ---------------------------------
  const renderTableHeader = () => {
    if (disasterType === "earthquake") {
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
          <th>Actions</th>
        </tr>
      );
    }
  };

  const renderTableRows = () =>
    data.map((item, idx) => {
      const rowId = item.id || item.earthquake_id || item.flood_id || item.firestorm_id;

      return (
        <tr key={idx}>
          <td>{new Date(item.timestamp).toLocaleString()}</td>

          <td>
            {editRow === rowId ? (
              <input
                type="number"
                value={editedData.richter_magnitude ?? item.richter_magnitude}
                onChange={(e) =>
                  setEditedData((prev) => ({
                    ...prev,
                    richter_magnitude: e.target.value,
                  }))
                }
              />
            ) : (
              item.richter_magnitude
            )}
          </td>

          <td>
            {editRow === rowId ? (
              <input
                type="number"
                value={editedData.moment_magnitude ?? item.moment_magnitude}
                onChange={(e) =>
                  setEditedData((prev) => ({
                    ...prev,
                    moment_magnitude: e.target.value,
                  }))
                }
              />
            ) : (
              item.moment_magnitude
            )}
          </td>

          <td>
            {editRow === rowId ? (
              <input
                type="number"
                value={editedData.energy_release ?? item.energy_release}
                onChange={(e) =>
                  setEditedData((prev) => ({
                    ...prev,
                    energy_release: e.target.value,
                  }))
                }
              />
            ) : (
              `${item.energy_release} J`
            )}
          </td>

          <td>{item.intensity}</td>
          <td>{item.epicenter?.latitude ?? "N/A"}</td>
          <td>{item.epicenter?.longitude ?? "N/A"}</td>
          <td>{item.depth_km}</td>
          <td>{item.damage_level}</td>
          <td>{item.soil_type}</td>
          <td>{item.infra_damage?.roads ?? "N/A"}</td>
          <td>{item.infra_damage?.bridges ?? "N/A"}</td>
          <td>{item.infra_damage?.buildings ?? "N/A"}</td>

          <td>
            {editRow === rowId ? (
              <button
                style={{ backgroundColor: "green", color: "white" }}
                onClick={() => handleSave(rowId)}
              >
                Save
              </button>
            ) : (
              <button
                style={{ backgroundColor: "orange", color: "white" }}
                onClick={() => startEditing(item)}
              >
                Edit
              </button>
            )}
          </td>
        </tr>
      );
    });

  // ---------------------------------
  // 🧩 Return (Render)
  // ---------------------------------
  return (
    <div style={{ padding: "0", margin: "0" }}>
      {/* Header Image */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "250px",
          overflow: "hidden",
        }}
      >
        <img
          src={getDisasterImage()}
          alt={`${disasterType} banner`}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <h1
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "white",
            fontSize: "2.5rem",
            textShadow: "2px 2px 8px rgba(0,0,0,0.8)",
            margin: 0,
          }}
        >
          {disasterType.charAt(0).toUpperCase() + disasterType.slice(1) + "s"}
        </h1>
      </div>

      {/* Controls */}
      <h2>Disaster Monitoring Dashboard</h2>
      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => setDisasterType("earthquake")}>Earthquakes</button>
        <button onClick={() => setDisasterType("flood")}>Floods</button>
        <button onClick={() => setDisasterType("firestorm")}>Firestorms</button>
      </div>

      {/* Filters */}
      <div style={{ marginBottom: "20px" }}>
        {Object.entries(filters[disasterType]).map(([key, value]) => (
          <input
            key={key}
            type="text"
            name={key}
            placeholder={key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
            value={value}
            onChange={handleFilterChange}
            style={{ marginRight: "8px", marginBottom: "8px" }}
          />
        ))}
        <button onClick={fetchData}>Apply Filters</button>
      </div>

      {/* Table */}
      <table
        border="1"
        cellPadding="10"
        cellSpacing="0"
        style={{ width: "100%", borderCollapse: "collapse" }}
      >
        <thead>{renderTableHeader()}</thead>
        <tbody>{renderTableRows()}</tbody>
      </table>
    </div>
  );
}

export default DisasterList;
