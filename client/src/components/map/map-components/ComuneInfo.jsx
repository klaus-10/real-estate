// import React, { useEffect, useState } from "react";
// import { useMap } from "react-leaflet";
// import { FaInfoCircle } from "react-icons/fa";

// import data from "../map-info-data/merged3.json";

// const ComuneInfo = ({ comune, provincia }) => {
//   const [comuneInside, setComuneInside] = useState(comune);
//   const [provinciaInside, setProvinciaInside] = useState(provincia);
//   const [zonaDescrizioneList, setZonaDescrizioneList] = useState([]);
//   const [zona, setZona] = useState("");

//   useEffect(() => {
//     if (comune && provincia) {
//       data[comune].map((el) =>
//         setZonaDescrizioneList((zonaDescrizioneList) => [
//           ...zonaDescrizioneList,
//           el.Zona_Descr,
//         ])
//       );
//     }
//   }, [comuneInside, provinciaInside]);

//   let comuneInfo = data[comune];

//   return (
//     <div className="topology-form topology-icon ">
//       <FaInfoCircle />
//       <div className="comune-info">
//         {comuneInfo && comuneInside && provinciaInside && (
//           <>
//             <div className="comune-row">
//               <p>Comune: {comuneInside}</p>
//               <p>Provincia: {provinciaInside}</p>
//             </div>

//             <div className="comune-row">
//               <p>Zona</p>

//               <select
//                 name="zona"
//                 id="zona"
//                 value={zona}
//                 onChange={(e) => {
//                   const selectedOption = e.target.selectedOptions[0];
//                   const label = selectedOption.getAttribute("data-label");
//                   const position = selectedOption.getAttribute("data-position");
//                   handleMacroareaSelection(label);
//                   handleMacroAreaSelected(position);
//                 }}
//               >
//                 {zonaDescrizioneList?.map((zona, pos) => (
//                   <option
//                     key={zona.label}
//                     value={zona.label}
//                     data-label={zona.label}
//                     data-position={pos}
//                   >
//                     {zona.label}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className="comune-row">
//               <p>Tipologia</p>
//               <p>Desc Zona</p>
//               <p>Stato</p>
//               <p>Min</p>
//               <p>Max</p>
//             </div>

//             {comuneInfo.data.map((el, index) => (
//               <div className="comune-row">
//                 <div className="comune-row">
//                   <p>{el.Descr_tip_prev}</p>
//                   <p>{el.Zona_Descr}</p>
//                   <p>{el.Stato}</p>
//                   <p>{el.Compr_min}</p>
//                   <p>{el.Compr_max}</p>
//                 </div>
//               </div>
//             ))}
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ComuneInfo;

import React, { useEffect, useState } from "react";
import { FaInfoCircle } from "react-icons/fa";

import data from "../map-info-data/merged3.json";

const ComuneInfo = ({ comune, provincia }) => {
  //   const [comuneList, setComuneList] = useState(data.map);
  //   const [comuneInside, setComuneInside] = useState(comune); // todo: toUpperCase()
  const comuneList = Object.keys(data);
  const [comuneInside, setComuneInside] = useState("MILANO");
  const [provinciaInside, setProvinciaInside] = useState("MILANO");
  const [zonaDescrizioneList, setZonaDescrizioneList] = useState([]);
  const [zonaDescrizioneSelectedList, setZonaDescrizioneSelectedList] =
    useState([]);
  const [zona, setZona] = useState("");

  useEffect(() => {
    console.log("OK FROM COMUNEINFO: ", comune, provincia);
    if (comuneInside) {
      const zoneDescriptions =
        data[comuneInside.toUpperCase()]?.map((el) => el.Zona_Descr) || [];

      // Filtering distinct values
      const distinctZoneDescriptions = [...new Set(zoneDescriptions)];

      setZonaDescrizioneList(distinctZoneDescriptions);
    }
  }, [comuneInside, provinciaInside]);

  useEffect(() => {
    console.log("OK FROM ZONA: ", zona);
    // console.log("Outside filter size: ", zonaDescrizioneList.length);
    if (zona) {
      //     zonaDescrizioneList.map((el) => el.Zona_Descr === zona) || [];
      //   console.log("Inside filter size: ", zonaTmp.length);
      setZonaDescrizioneSelectedList(
        data[comuneInside].filter((el) => el.Zona_Descr === zona)
      );

      console.log("Zona Selected: ", zonaDescrizioneSelectedList);
    }

    console.log("OK FROM ZONADESCRIZIONESELECTEDLIST: ", zonaDescrizioneList);
  }, [zona, zonaDescrizioneList]); // Add zonaDescrizioneList to the dependencies array

  console.log("OK FROM COMUNEINFO OUTSIDE: ", comune, provincia);
  console.log(
    "OK FROM COMUNEINFO inside_OUTSIDE: ",
    comuneInside,
    provinciaInside
  );

  console.log("ZONA: ", zona);

  console.log("DATA FROM COMUNE inside_OUTSIDE: ", data[comuneInside]);

  let comuneInfo = data[comuneInside];

  const handleComuneChange = (e) => {
    setComuneInside(e.target.value);
  };

  return (
    <div className="topology-form topology-icon comune-info-container">
      <FaInfoCircle />
      <div className="comune-info">
        <div className="comune-row">
          <input
            list="europe-countries"
            placeholder="Start typing..."
            onChange={handleComuneChange}
            value={comuneInside}
          />
          <datalist id="europe-countries">
            {comuneList &&
              comuneList.map((el, index) => <option key={index} value={el} />)}
          </datalist>
        </div>

        {comuneInfo && provinciaInside && (
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
                  const position = selectedOption.getAttribute("data-position");
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
    </div>
  );
};

export default ComuneInfo;
