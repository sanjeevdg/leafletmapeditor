import React, { useEffect } from "react";
import { MapContainer } from "react-leaflet";
import { useLeafletContext } from "@react-leaflet/core";
import L from "leaflet";

// Import CSS & plugins
import "leaflet/dist/leaflet.css";
import "leaflet.vectorgrid";
import "@maplibre/maplibre-gl-leaflet";// enables L.mapboxGL

// ==========================
// MapTiler Vector Basemap
// ==========================
const MapTilerVectorBasemap: React.FC<{ styleUrl: string }> = ({ styleUrl }) => {
  const context = useLeafletContext();

  useEffect(() => {
    if (!context.map) return;

    const maplibreLayer = (L as any).maplibreGL({
      style: styleUrl, // MapTiler style JSON
    });

    maplibreLayer.addTo(context.map);

    return () => {
      maplibreLayer.remove();
    };
  }, [context.map, styleUrl]);

  return null;
};

// ==========================
// PostGIS Vector Tile Layer
// ==========================
const VectorTileLayer: React.FC<{ url: string }> = ({ url }) => {
  const context = useLeafletContext();

//MapboxGL.setAccessToken('pk.eyJ1IjoicGlubmNvbm4iLCJhIjoiY21jOWNsYzM2MTM5ZjJtb2VzOXo4dDBpNiJ9.8xT9bOmhiUPhPJHSYKyKlg'); // not used since MapTiler is URL-based

  useEffect(() => {
    if (!context.map) return;

    const vectorTileLayer = (L as any).vectorGrid.protobuf(url, {
      vectorTileLayerStyles: {
        // Replace "my_layer" with the actual layer name from your PostGIS MVT
        features: {
          point: {
            radius: 3,
            fillColor: "#4caf50",
            color: "black",
            weight: 1,
            fillOpacity: 0.8,
          },
          line: {
            color: "#ff5722",
            weight: 2,
          },
          polygon: {
            color: "green",
            fillColor: "rgba(255, 0, 0, 0.3)",
            fillOpacity: 0.4,
          },
        },
      },
      interactive: true,
      maxZoom: 22,
    });

    vectorTileLayer.addTo(context.map);

    vectorTileLayer.on("click", (e: any) => {
      console.log("Clicked feature:", e.layer.properties);
    });

    return () => {
      vectorTileLayer.remove();
    };
  }, [context.map, url]);

  return null;
};

// ==========================
// Main Map Component
// ==========================
const Map2: React.FC = () => {
  const MAPTILER_KEY = "b59pIgoNGnhNHBDuQlry";
  const MAPTILER_VECTOR_STYLE = `https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_KEY}`;

  const POSTGIS_TILE_URL = "http://localhost:3001/tiles/{z}/{x}/{y}.pbf";

  return (
    <MapContainer
      center={[21.1458, 79.0882]} // Nagpur, India
      zoom={8}
      style={{ height: "100vh", width: "100%" }}
    >
      {/* Basemap */}
      <MapTilerVectorBasemap styleUrl={MAPTILER_VECTOR_STYLE} />

      {/* PostGIS Overlay */}
      <VectorTileLayer url={POSTGIS_TILE_URL} />
    </MapContainer>
  );
};

export default Map2;

