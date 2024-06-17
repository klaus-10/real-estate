import React, { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import Home from "../../assets/images/home.png";

const DisplayPOI = ({ poi, poiIconAnimation }) => {
  const map = useMap();
  const parentLayerRef = useRef(null);
  const childLayersRef = useRef([]);

  useEffect(() => {
    const parentLayer = L.featureGroup().addTo(map);
    parentLayerRef.current = parentLayer;

    // Clear previous child layers
    childLayersRef.current.forEach((layer) => parentLayer.removeLayer(layer));
    childLayersRef.current = [];

    if (poi && Array.isArray(poi)) {
      poi.forEach((point) => {
        const lat = parseFloat(point?.realEstate?.loc?.coordinates[1]);
        const lng = parseFloat(point?.realEstate?.loc?.coordinates[0]);
        if (isNaN(lat) || isNaN(lng)) {
          console.error("Invalid source coordinates");
          return;
        }

        const iconHtml = `<div class="icon-inner" style="transform: translateY(-5px); box-shadow: 0 0 5px #00B4D8, 0 0 10px #0000;"><img src="${Home}" width="20" height="20" style="background: white; border-radius: 50%;" /></div>`;

        const marker = L.marker([lat, lng], {
          icon: L.divIcon({
            className: `icon-wrapper`,
            html: iconHtml,
          }),
        }).addTo(map);

        marker.bindPopup(
          `<div class="popupContainer">
             <img src="${
               point.realEstate?.properties[0]?.photos?.urls?.small ||
               point.realEstate?.properties[0]?.multimedia.photos[0]?.urls
                 ?.small
             }" alt="" />
             <div class="textContainer">
               <a href="${
                 point?.seo?.url
               }" target="_blank" rel="noopener noreferrer">
                 ${point.seo?.title}
               </a>
               <span>${
                 point.realEstate?.properties[0]?.bedRoomsNumber
               } bedroom</span>
               <span>${
                 point.realEstate?.properties[0]?.bathrooms
               } bathrooms</span>
               <span>${point.realEstate?.properties[0]?.rooms} rooms</span>
               <b>${point?.realEstate?.price?.formattedValue}</b>
             </div>
           </div>`
        );

        parentLayer.addLayer(marker);
        childLayersRef.current.push(marker);

        // Apply animation on mouseover
        marker.on("mouseover", () => {
          marker._icon.querySelector(".icon-inner").classList.add("animate");
        });

        // Remove animation on mouseout
        marker.on("mouseout", () => {
          marker._icon.querySelector(".icon-inner").classList.remove("animate");
        });

        // Apply animation to marker if needed
        if (poiIconAnimation && poiIconAnimation.index === point._id) {
          const currentAnimationState = poiIconAnimation.state;

          if (currentAnimationState === "active") {
            marker._icon.querySelector(".icon-inner").classList.add("animate");
          } else {
            marker._icon
              .querySelector(".icon-inner")
              .classList.remove("animate");
          }
        }
      });
    }

    // Cleanup function
    return () => {
      if (parentLayerRef.current) {
        parentLayerRef.current.clearLayers();
        map.removeLayer(parentLayerRef.current);
      }
    };
  }, [poi, map, poiIconAnimation]);

  return null;
};

export default DisplayPOI;
