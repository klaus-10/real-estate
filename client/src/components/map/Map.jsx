import { MapContainer, TileLayer } from "react-leaflet";
import "./map.scss";
import "leaflet/dist/leaflet.css";
import CurrentLocation from "../current-location/CurrentLocation";
import Pin from "../pin/Pin";
import { useEffect, useState } from "react";
import MapBoundingBox from "./map-components/BoundingBox";
import SearchInMap from "./map-components/SearchInMap";
import PinCircle from "../pin/PinCircle";

function Map({
  items,
  allRealStatesData,
  centerFromParent,
  handleIsMapSearch,
  isMapSearch,
  boundingBox,
  setBoundingBox,
}) {
  // center position on text label change
  const [center, setCenter] = useState([45.5188, 9.214]);
  const [location, setLocation] = useState(null);

  const handleBoundingBoxChange = (newBoundingBox) => {
    setBoundingBox(newBoundingBox);
  };

  useEffect(() => {
    console.log(
      "real-estate base: ",
      items && items.length,
      " real-estate total: ",
      allRealStatesData && allRealStatesData.length
    );
  });

  // TODO: add current location position
  return (
    <MapContainer
      center={center}
      zoom={15}
      scrollWheelZoom={false}
      className="map"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* // map all the pins here */}
      {items && items.map((item) => <Pin item={item} key={item._id} />)}
      {allRealStatesData &&
        allRealStatesData.map((item) => (
          <PinCircle item={item} key={item._id} />
        ))}

      {/* // retrive current location for query? */}
      <div className="current_location_map">
        <CurrentLocation setLocation={setLocation} />
      </div>

      {/* Include MapBoundingBox component to retrieve bounding box */}
      <MapBoundingBox onBoundingBoxChange={handleBoundingBoxChange} />

      {/* Button to enable the map search */}
      {/* TODO: set isVisible */}
      <SearchInMap
        isVisible={isMapSearch}
        handleIsMapSearch={handleIsMapSearch}
      />
    </MapContainer>
  );
}

export default Map;
