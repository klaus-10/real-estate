import React, { useEffect, useState } from "react";
import { FaInfoCircle } from "react-icons/fa";

import data from "../map/map-info-data/merged3.json";
import "./comuneInfo.scss";

const ComuneInfo = ({ comune, provincia }) => {
  const comuneList = Object.keys(data);
  const [comuneInside, setComuneInside] = useState(comune.toUpperCase());
  const [provinciaInside, setProvinciaInside] = useState(
    data[comune.toUpperCase()] ? [0].Prov_y : ""
  );
  const [zonaDescrizioneList, setZonaDescrizioneList] = useState([]);
  const [zonaDescrizioneSelectedList, setZonaDescrizioneSelectedList] =
    useState([]);
  const [zona, setZona] = useState("");

  useEffect(() => {
    if (comune) {
      setComuneInside(comune.toUpperCase());
      setProvinciaInside(data[comune.toUpperCase()] ? [0].Prov_y : "");
      const zoneDescriptions =
        data[comune.toUpperCase()]?.map((el) => el.Zona_Descr) || [];

      // Filtering distinct values
      const distinctZoneDescriptions = [...new Set(zoneDescriptions)];

      setZonaDescrizioneList(distinctZoneDescriptions);
    }
  }, [comune]);

  useEffect(() => {
    if (zona) {
      setZonaDescrizioneSelectedList(
        data[comuneInside]?.filter((el) => el.Zona_Descr === zona)
      );
    }
  }, [zona, zonaDescrizioneList]); // Add zonaDescrizioneList to the dependencies array

  let comuneInfo = data[comuneInside];

  const handleComuneChange = (e) => {
    setComuneInside(e.target.value);
    setProvinciaInside(data[e.target.value.toUpperCase()] ? [0].Prov_y : "");
  };

  const [displayInfo, setDisplayInfo] = useState(false);
  const handleDisplayInfo = () => {
    setDisplayInfo(!displayInfo);
  };

  return (
    <div className="comune-info-container">
      <div
        style={{ padding: "8px", background: "white", borderRadius: "6px" }}
        onClick={handleDisplayInfo}
      >
        <FaInfoCircle />
      </div>
      {displayInfo && (
        <div className="comune-info">
          <div className="comune-row">
            <p>Select:</p>
            <input
              list="europe-countries"
              placeholder="Start typing..."
              onChange={handleComuneChange}
              value={comuneInside}
            />
            <datalist id="europe-countries">
              {comuneList &&
                comuneList.map((el, index) => (
                  <option key={index} value={el} />
                ))}
            </datalist>
          </div>

          {comuneInfo && (
            <>
              <div className="comune-row">
                <p>Comune: {comuneInside}</p>
                <p>Provincia: {provinciaInside}</p>
              </div>

              <div className="comune-row">
                <p>Zona</p>
                <select
                  name="zona"
                  id="zona"
                  value={zona}
                  onChange={(e) => {
                    const selectedOption = e.target.selectedOptions[0];
                    const label = selectedOption.getAttribute("data-label");
                    const position =
                      selectedOption.getAttribute("data-position");
                    setZona(label); // Update the selected zona
                  }}
                >
                  {zonaDescrizioneList.map((zonaDescr, pos) => (
                    <option
                      key={pos}
                      value={zonaDescr}
                      data-label={zonaDescr}
                      data-position={pos}
                    >
                      {zonaDescr}
                    </option>
                  ))}
                </select>
              </div>

              <div className="comune-row">
                <p>Tipologia</p>
                <p>Desc Zona</p>
                <p>Stato</p>
                <p>Min</p>
                <p>Max</p>
              </div>

              {zonaDescrizioneSelectedList &&
                zonaDescrizioneSelectedList.map((el, index) => (
                  <div key={index} className="comune-row">
                    <p>{el.Descr_tip_prev}</p>
                    <p>{el.Zona_Descr}</p>
                    <p>{el.Stato}</p>
                    <p>{el.Compr_min}</p>
                    <p>{el.Compr_max}</p>
                  </div>
                ))}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ComuneInfo;
