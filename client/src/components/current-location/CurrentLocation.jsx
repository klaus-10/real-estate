import React, { useEffect, useState, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import { icon } from "../map/Constants";

import "./CurrentLocation.css";

const CurrentLocation = ({ setLocation }) => {
  const map = useMap();
  const currentLocationMarkerRef = useRef(null);

  useEffect(() => {
    if (currentLocationMarkerRef.current) {
      map.removeLayer(currentLocationMarkerRef.current);
    }
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          setLocation({ latitude, longitude });

          const currentLocationMarker = L.marker([latitude, longitude], {
            icon: icon,
          }).addTo(map);
          currentLocationMarker.bindPopup(
            `Latitude: ${latitude.toFixed(6)}, Longitude: ${longitude.toFixed(
              6
            )}`
          );
          currentLocationMarkerRef.current = currentLocationMarker;

          // Optionally, you can also center the map to the current location
          map.setView([latitude, longitude], map.getZoom());
        },
        (error) => {
          console.error("Geolocation error:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported in this browser.");
    }
  }, [map]);

  return null;
};

export default CurrentLocation;
