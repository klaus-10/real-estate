import { useMap } from "react-leaflet";
import { useEffect } from "react";

const MapBoundingBox = ({ onBoundingBoxChange, isMapSearch }) => {
  const map = useMap();

  useEffect(() => {
    // if (!isMapSearch) return;
    const handleMoveEnd = () => {
      const mapBounds = map.getBounds();
      // const northwest = mapBounds.getNorthWest();
      // const southeast = mapBounds.getSouthEast();

      const boundingBox = {
        north: mapBounds.getNorth(),
        east: mapBounds.getEast(),
        south: mapBounds.getSouth(),
        west: mapBounds.getWest(),
      };

      // Pass bounding box to the parent component
      onBoundingBoxChange(boundingBox);
    };

    // Trigger handleMoveEnd when the map is ready (on load)
    map.whenReady(handleMoveEnd);

    // Listen for both 'moveend' and 'zoomend' events
    map.on("moveend", handleMoveEnd);
    map.on("zoomend", handleMoveEnd); // Already included for completeness

    // Cleanup function
    return () => {
      map.off("moveend", handleMoveEnd);
      map.off("zoomend", handleMoveEnd);
    };
  }, [map]);

  // This component doesn't render anything directly
  return null;
};

export default MapBoundingBox;
