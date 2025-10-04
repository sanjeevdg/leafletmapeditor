import { createLayerComponent } from "@react-leaflet/core";
import L from "leaflet";
import maplibregl from "maplibre-gl";
import "@maplibre/maplibre-gl-leaflet";

interface MaplibreLayerProps {
  style: string | object;
  interactive?: boolean;
  pane?: string;
  attribution?: string;
  name?: string;
}

// Factory function
const createMaplibreLayer = (props: MaplibreLayerProps) => {
  const layer = (L as any).maplibreGL({
    style: props.style,
    maplibregl,
    interactive: props.interactive ?? false,
  });
  return layer;
};

// Export React-Leaflet layer component
export const MaplibreGLLayer = createLayerComponent<L.Layer, MaplibreLayerProps>(
  createMaplibreLayer
);

