import React, { useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useLeafletContext } from "@react-leaflet/core";

import "leaflet.vectorgrid"; // Make sure leaflet.vectorgrid is installed
import "leaflet-mapbox-gl"; 

// Custom Vector Tile Layer component
interface VectorTileLayerProps {
  url: string;
}

const VectorTileLayer: React.FC<VectorTileLayerProps> = ({ url }) => {
  const context = useLeafletContext();

  useEffect(() => {
    if (!context.map) return;

const vectorTileLayer = (L as any).vectorGrid.protobuf(url, {
      vectorTileLayerStyles: {
        // Example style; adjust according to your PostGIS layers
        features: {
          weight: 1,
          color: "#ff7800",
          fillColor: "#fffc00",
          fillOpacity: 0.3,
        },
      },
      interactive: true,
      maxZoom: 22,
    });

    vectorTileLayer.addTo(context.map);

    vectorTileLayer.on("click", (e: any) => {
      console.log("Feature clicked:", e.layer.properties);
    });

    return () => {
      vectorTileLayer.remove();
    };
  }, [context.map, url]);

  return null;
};

// Main Map component
const Map: React.FC = () => {
  const MAPTILER_KEY = "b59pIgoNGnhNHBDuQlry";
  const POSTGIS_TILE_URL = "http://localhost:3001/tiles/{z}/{x}/{y}.pbf"; // Your express tile server

  return (
    <MapContainer
      center={[21.1458, 79.0882]} // Nagpur, India
      zoom={8}
      style={{ height: "100vh", width: "100%" }}
    >
      {/* Basemap from MapTiler */}
      <TileLayer
        url={`https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=${MAPTILER_KEY}`}
        attribution='&copy; <a href="https://www.maptiler.com/copyright/">MapTiler</a>'
      />

      {/* PostGIS Vector Tile Layer */}
      <VectorTileLayer url={POSTGIS_TILE_URL} />
    </MapContainer>
  );
};

export default Map;

