import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const MapLibreTiles = () => {
  const mapContainerRef = useRef(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: {
        version: 8,
        sources: {
          'postgis-tiles': {
            type: 'vector',
            tiles: ['http://localhost:3001/tiles/{z}/{x}/{y}.pbf'],
            minzoom: 0,
            maxzoom: 14
          }
        },
        layers: [
          // Points
          {
            id: 'points-layer',
            type: 'circle',
            source: 'postgis-tiles',
            'source-layer': 'features', // must match ST_AsMVT layer name
            filter: ['==', '$type', 'Point'],
            paint: {
              'circle-radius': 5,
              'circle-color': '#FF5722'
            }
          },
          // Lines
          {
            id: 'lines-layer',
            type: 'line',
            source: 'postgis-tiles',
            'source-layer': 'features',
            filter: ['==', '$type', 'LineString'],
            paint: {
              'line-width': 2,
              'line-color': '#2196F3'
            }
          },
          // Polygons
          {
            id: 'polygons-layer',
            type: 'fill',
            source: 'postgis-tiles',
            'source-layer': 'features',
            filter: ['==', '$type', 'Polygon'],
            paint: {
              'fill-color': '#4CAF50',
              'fill-opacity': 0.4
            }
          }
        ]
      },
      center: [79.0882, 21.1458], // Nagpur
      zoom: 8
    });

    return () => map.remove();
  }, []);

  return <div ref={mapContainerRef} style={{ width: '100%', height: '100vh' }} />;
};

export default MapLibreTiles;


