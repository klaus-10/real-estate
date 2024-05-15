import { useMap } from 'react-leaflet';
import { useEffect } from 'react';

const MapBoundingBox = ({ onBoundingBoxChange }) => {
  const map = useMap();

  useEffect(() => {
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
    map.on('moveend', handleMapChange);
    map.on('zoomend', handleMapChange); // Already included for completeness

    // Cleanup function
    return () => {
      map.off('moveend', handleMapChange);
      map.off('zoomend', handleMapChange);
    };
  }, [map, onBoundingBoxChange]);

  // This component doesn't render anything directly
  return null;
};

export default MapBoundingBox;
