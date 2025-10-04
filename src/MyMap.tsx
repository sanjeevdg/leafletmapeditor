import React, { useEffect } from "react";
import maplibregl from "maplibre-gl";

export default function MyMap() {
  useEffect(() => {
    const map = new maplibregl.Map({
      container: "map",
      style: `https://api.maptiler.com/maps/streets/style.json?key=b59pIgoNGnhNHBDuQlry`,
      center: [78.5, 21.1],
      zoom: 3
    });

    map.on("load", () => {
      map.addSource("mydata", {
        type: "vector",
        tiles: ["https://editablemapbackend.onrender.com/tiles/{z}/{x}/{y}.pbf"],
        minzoom: 0,
        maxzoom: 14
      });

      // Add layers
      map.addLayer({
        id: "my-points",
        type: "circle",
        source: "mydata",
        "source-layer": "my_points",
        paint: { "circle-radius": 6, "circle-color": "#4caf50" }
      });

      map.addLayer({
        id: "my-lines",
        type: "line",
        source: "mydata",
        "source-layer": "my_lines",
        paint: { "line-color": "#ff5722", "line-width": 2 }
      });

      map.addLayer({
        id: "my-polygons",
        type: "fill",
        source: "mydata",
        "source-layer": "my_polygons",
        paint: { "fill-color": "#00bcd4", "fill-opacity": 0.3 }
      });
map.addLayer({
  id: "my-polygons-border",
  type: "line",
  source: "mydata",
  "source-layer": "my_polygons",
  paint: {
    "line-color": "#00bcd4", // border color
    "line-width": 2
  }
});
         // Popup instance
      const popup = new maplibregl.Popup({
        closeButton: false,
        closeOnClick: false
      });

      // Show popup on hover
      ["my-points", "my-lines", "my-polygons"].forEach(layerId => {
        map.on("click", layerId, e => {
          map.getCanvas().style.cursor = "pointer";

           if (e.features && e.features.length > 0) {
            const feature = e.features[0];

            popup
              .setLngLat(e.lngLat)
              .setHTML(`<strong>${layerId}</strong><br>ID: ${feature.geometry.type}`)
              .addTo(map);
          }
        });

        // Hide popup when leaving feature
        map.on("mouseleave", layerId, () => {
          map.getCanvas().style.cursor = "";
          popup.remove();
        });
      });
    });

    return () => map.remove();
  }, []);

  return <div id="map" style={{ width: "100%", height: "100vh" }} />;
}

