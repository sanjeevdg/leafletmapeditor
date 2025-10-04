import React, { useEffect, useRef } from "react";
import maplibregl, { StyleSpecification, MapMouseEvent, MapGeoJSONFeature } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

function App() {

const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);


  const map = new maplibregl.Map({
  container: mapContainer.current!,
  style: {
    version: 8,
    sources: {
      postgisTiles: {
        type: "raster",
        tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
        tileSize: 256,
      },
    },
    layers: [
      {
        id: "osm",
        type: "raster",
        source: "postgisTiles",
      },
    ],
  },
  center: [78.088, 21.1458],
  zoom: 8,
});

}

export default App;
