import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet-draw";
//import { createPortal } from "react-dom";
//import ReactDOM from "react-dom";
import { createRoot } from "react-dom/client";



interface Feature {
  id: number;
  geometry: GeoJSON.Geometry;
  properties: Record<string, any>;
  type: "Feature";
}

const saveUrl = "http://localhost:3001/api/features";
const listUrl = "http://localhost:3001/api/features";

const PopupForm: React.FC<{
  feature: Feature;
  onSaved: () => void;
}> = ({ feature, onSaved }) => {
  const [props, setProps] = useState<Record<string, any>>({ ...(feature.properties || {}) });

  const handleChangeKey = (oldKey: string, newKey: string) => {
    setProps((prev) => {
      const copy = { ...prev };
      const value = copy[oldKey];
      delete copy[oldKey];
      copy[newKey] = value;
      return copy;
    });
  };

  const handleChangeValue = (key: string, value: string) => {
    setProps((prev) => ({ ...prev, [key]: value }));
  };

  const handleRemove = (key: string) => {
    setProps((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  };

  const handleAdd = () => {
    // Add a blank key/value pair
    let newKey = "";
    let i = 0;
    while (props.hasOwnProperty(newKey) && i < 1000) {
      newKey = `new_${i++}`;
    }
    setProps((prev) => ({ ...prev, [newKey]: "" }));
  };

  const handleSave = async () => {
    const updatedFeature = { ...feature, properties: props };
    try {
      const res = await fetch(`${saveUrl}/${feature.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFeature),
      });
      if (!res.ok) throw new Error("Save failed");
      onSaved();
// await loadFeatures();
      alert("Saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Error saving feature");
    }
  };

  return (
    <div style={{ minWidth: "300px", maxWidth: "500px", padding: "8px" }}>
      {Object.entries(props).map(([key, value], idx) => (
        <div key={idx} style={{ marginBottom: "6px" }}>
          <input
            style={{ width: "40%" }}
            placeholder="Key"
            value={key}
            onChange={(e) => handleChangeKey(key, e.target.value)}
          />
          <input
            style={{ width: "50%", marginLeft: "4px" }}
            placeholder="Value"
            value={value}
            onChange={(e) => handleChangeValue(key, e.target.value)}
          />
          <button
            type="button"
            onClick={() => handleRemove(key)}
            style={{ marginLeft: "4px" }}
          >
            ❌
          </button>
        </div>
      ))}

      <button type="button" onClick={handleAdd} style={{ marginTop: "4px" }}>
        ➕ Add Field
      </button>
      <br />
      <button
        type="button"
        onClick={handleSave}
        style={{ marginTop: "8px", width: "100%" }}
      >
        💾 Save
      </button>
    </div>
  );
};

export const FeatureLayer: React.FC = () => {
  const map = useMap();
  const [features, setFeatures] = useState<Feature[]>([]);

  const loadFeatures = async () => {
    try {
      const res = await fetch(listUrl);
      const fc = await res.json();
      setFeatures(fc.features || []);
    } catch (err) {
      console.error("Failed to load features", err);
    }
  };

  useEffect(() => {
    loadFeatures();
  }, []);

  useEffect(() => {
    if (!features.length) return;

    const layerGroup = L.geoJSON(features as any, {
      onEachFeature: (feature: Feature, layer) => {
        layer.on("click", () => {
  const container = document.createElement("div");

  // Unbind existing popup if any
  layer.unbindPopup();

  // Bind new popup with fresh container
  layer.bindPopup(container, {
    maxWidth: 500,
    minWidth: 300,
    className: "leaflet-popup-custom",
  }).openPopup();

  setTimeout(() => {
    const root = createRoot(container);
    const latestFeature = features.find((f) => f.id === feature.id)!; // latest from state
    root.render(<PopupForm feature={latestFeature} onSaved={loadFeatures} />);
  }, 0);
});
      },
    });

    layerGroup.addTo(map);
    return () => {
      map.removeLayer(layerGroup);
    };
  }, [features, map]);

  return null;
};

export const MapEditor = () => {




  return (
    <MapContainer
      center={[20.5937, 78.9629]}
      zoom={5}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        url="https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=b59pIgoNGnhNHBDuQlry"
        attribution='&copy; <a href="https://www.maptiler.com/">MapTiler</a>'
      />
      <FeatureLayer />
    </MapContainer>
  );
};

