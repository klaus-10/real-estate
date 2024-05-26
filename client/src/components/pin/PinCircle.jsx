// import { CircleMarker, Marker, Popup } from "react-leaflet";
// import "./pinCircle.scss";
// import { Link } from "react-router-dom";

// function PinCircle({ item }) {
//   // console.log("PinCircle_item: ", item);
//   return (
//     <>
//       {item?.realEstate?.loc && (
//         <CircleMarker
//           radius={4}
//           color="#03045E"
//           fillColor="#03045E"
//           // color="#FFFFFF"
//           // fillOpacity={1}
//           center={[
//             item?.realEstate?.loc?.coordinates[1],
//             item?.realEstate?.loc?.coordinates[0],
//           ]}
//         />
//       )}
//     </>
//   );
// }

// export default PinCircle;

import React, { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "./pinCircle.scss";

const PinCircle = ({ items }) => {
  const map = useMap();
  const parentLayerRef = useRef(null);
  const childLayersRef = useRef([]);

  useEffect(() => {
    const parentLayer = L.featureGroup().addTo(map);
    parentLayerRef.current = parentLayer;

    // Clear previous child layers
    childLayersRef.current.forEach((layer) => parentLayer.removeLayer(layer));
    childLayersRef.current = [];

    if (items && Array.isArray(items)) {
      items.forEach((item) => {
        const lat = parseFloat(item?.realEstate?.loc?.coordinates[1]);
        const lng = parseFloat(item?.realEstate?.loc?.coordinates[0]);
        if (isNaN(lat) || isNaN(lng)) {
          console.error("Invalid coordinates");
          return;
        }

        // const marker = L.circleMarker([lat, lng], {
        //   radius: 4,
        //   color: "#03045E",
        //   fillColor: "#03045E",
        // }).addTo(map);

        const iconHtml = `
          <div style="
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background-color: #03045E;
            box-shadow: 0 0 5px #00B4D8, 0 0 10px #0000;
          "></div>
        `;

        const marker = L.marker([lat, lng], {
          icon: L.divIcon({
            className: `icon-wrapper`,
            html: iconHtml,
          }),
        }).addTo(map);

        parentLayer.addLayer(marker);
        childLayersRef.current.push(marker);
      });
    }

    // Cleanup function
    return () => {
      if (parentLayerRef.current) {
        parentLayerRef.current.clearLayers();
        map.removeLayer(parentLayerRef.current);
      }
    };
  }, [items, map]);

  return null;
};

export default PinCircle;
