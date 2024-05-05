import { MapContainer, TileLayer } from "react-leaflet";
import "./map.scss";
import "leaflet/dist/leaflet.css";
import CurrentLocation from "../current-location/CurrentLocation";
import Pin from "../pin/Pin";
import { useState } from "react";

function Map({ items }) {
  const [center, setCenter] = useState([45.5188, 9.214]);
  const [location, setLocation] = useState(null);

  return (
    <MapContainer
      center={center}
      zoom={15}
      scrollWheelZoom={true}
      // scrollWheelZoom={false}
      className="map"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {items.map((item) => (
        <Pin item={item} key={item.id} />
      ))}

      <div className="current_location_map">
        <CurrentLocation setLocation={setLocation} />
      </div>
    </MapContainer>
  );
}

export default Map;
