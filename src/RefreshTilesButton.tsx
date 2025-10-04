import React from "react";
import type { Map } from "leaflet";

interface Props {
  mapRef: React.RefObject<Map | null>; // allow null
}

export const RefreshTilesButton: React.FC<Props> = ({ mapRef }) => {
  const handleRefresh = () => {
    const map = mapRef.current;
    if (!map) return;

    const mlLayer = (map as any).__maplibreLayer;
    if (!mlLayer || !mlLayer._glMap) return;

    // reload current style to refresh vector tiles
    mlLayer._glMap.setStyle(mlLayer._glMap.getStyle());
  };

  return (
    <button
      style={{
        position: "absolute",
        top: 10,
        right: 10,
        zIndex: 1000,
        padding: "6px 12px",
        background: "white",
        border: "1px solid #ccc",
        borderRadius: 4,
        cursor: "pointer",
      }}
      onClick={handleRefresh}
    >
      Refresh PostGIS Tiles
    </button>
  );
};

