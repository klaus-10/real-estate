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

    map.on('zoomend', handleMoveEnd);

    // Cleanup function
    return () => {
      map.off('zoomend', handleMoveEnd);
    };
  }, [map, onBoundingBoxChange]);

  // This component doesn't render anything directly
  return null;
};

export default MapBoundingBox;
