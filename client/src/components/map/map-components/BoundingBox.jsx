import { useMap } from "react-leaflet";
import { useEffect } from "react";

const MapBoundingBox = ({ onBoundingBoxChange, isMapSearch }) => {
  const map = useMap();

  useEffect(() => {
    if (!isMapSearch) return;
    const handleMoveEnd = () => {
      const mapBounds = map.getBounds();
      const northwest = mapBounds.getNorthWest();
      const southeast = mapBounds.getSouthEast();

      const boundingBox = {
        north: northwest.lat,
        east: northwest.lng,
        south: southeast.lat,
        west: southeast.lng,
      };

      // Pass bounding box to the parent component
      onBoundingBoxChange(boundingBox);
    };

    // Listen for both 'moveend' and 'zoomend' events
    map.on("moveend", onBoundingBoxChange);
    map.on("zoomend", onBoundingBoxChange); // Already included for completeness

    // Cleanup function
    return () => {
      map.off("moveend", onBoundingBoxChange);
      map.off("zoomend", onBoundingBoxChange);
    };
  }, [map]);

  // This component doesn't render anything directly
  return null;
};

export default MapBoundingBox;
