import React, { useEffect } from "react";
import { useMap } from "react-leaflet";

const CenterMap = (props) => {
  const map = useMap();

  useEffect(() => {
    map.setView(props?.center, 12);
  }, [props.center]);

  return null;
};

export default CenterMap;
