import { useMap } from "react-leaflet";
import { useEffect } from "react";

const SearchInMap = ({ handleIsMapSearch, isVisible }) => {
  const search_btn = (
    <button
      className="search-btn"
      style={{
        position: "absolute",
        zIndex: 1000,
        left: "50%",
        transform: "translateX(-50%)",
        top: "10px",
      }}
      onClick={() => handleIsMapSearch(true)}
    >
      Search here
    </button>
  );

  return isVisible ? null : search_btn;
};

export default SearchInMap;
