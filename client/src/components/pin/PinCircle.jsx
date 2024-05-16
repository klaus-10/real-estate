import { CircleMarker, Marker, Popup } from "react-leaflet";
import "./pinCircle.scss";
import { Link } from "react-router-dom";

function PinCircle({ item }) {
  // console.log("PinCircle_item: ", item);
  return (
    <>
      {item?.realEstate?.loc && (
        <CircleMarker
          radius={4}
          color="#03045E"
          fillColor="#03045E"
          // color="#FFFFFF"
          // fillOpacity={1}
          center={[
            item?.realEstate?.loc?.coordinates[1],
            item?.realEstate?.loc?.coordinates[0],
          ]}
        />
      )}
    </>
  );
}

export default PinCircle;
