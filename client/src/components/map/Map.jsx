import { MapContainer, Polygon, TileLayer } from "react-leaflet";
import "./map.scss";
import "leaflet/dist/leaflet.css";
import CurrentLocation from "../current-location/CurrentLocation";
import Pin from "../pin/Pin";
import { useEffect, useState } from "react";
import MapBoundingBox from "./map-components/BoundingBox";
import SearchInMap from "./map-components/SearchInMap";
import PinCircle from "../pin/PinCircle";
import DisplayPOI from "../pin/DisplayPoi";
import CenterMap from "./map-components/CenterMap";

function Map({
  items,
  allRealStatesData,
  centerFromParent,
  handleIsMapSearch,
  isMapSearch,
  boundingBox,
  setBoundingBox,
  poiIconAnimation,
  currentCityDisplayed,
  filterOptions,
}) {
  // center position on text label change
  const [center, setCenter] = useState([45.5188, 9.214]);
  const [location, setLocation] = useState(null);
  const [coordinates, setCoordinates] = useState(null);

  const handleBoundingBoxChange = (newBoundingBox) => {
    setBoundingBox(newBoundingBox);
  };

  const purpleOptions = { color: "purple" };

  useEffect(() => {
    const tmpCoordinates = currentCityDisplayed?.geojson?.coordinates[0].map(
      (coord) => [coord[1], coord[0]]
    );
    setCoordinates(tmpCoordinates);
    // change center of the map
    let lat = parseFloat(currentCityDisplayed?.lat);
    let lon = parseFloat(currentCityDisplayed?.lon);

    if (!isNaN(lat) && !isNaN(lon)) {
      setCenter([lat, lon]);
    } else {
      console.error("Invalid lat/lon values: ", lat, lon);
    }

    // todo add navigate animation to react-leaflet map
  }, [currentCityDisplayed]);

  return (
    <MapContainer
      center={center}
      zoom={15}
      scrollWheelZoom={isMapSearch ? false : true}
      className="map"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* // map all the pins here */}
      {/* {items &&
        items.map((item) => (
          <Pin item={item} key={item._id} poiIconAnimation={poiIconAnimation} />
        ))} */}
      {items && <DisplayPOI poi={items} poiIconAnimation={poiIconAnimation} />}
      {/* {allRealStatesData &&
        allRealStatesData.map((item) => (
          <PinCircle item={item} key={item._id} />
        ))} */}

      {allRealStatesData && <PinCircle items={allRealStatesData} />}

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

      {/* Current boundary box city displayed*/}
      {currentCityDisplayed &&
        // && !isMapSearch
        filterOptions.city !== undefined &&
        filterOptions.city != null &&
        filterOptions.city != "" &&
        coordinates && (
          <Polygon pathOptions={purpleOptions} positions={coordinates} />
        )}

      {center && <CenterMap center={center} />}
    </MapContainer>
  );
}

export default Map;
