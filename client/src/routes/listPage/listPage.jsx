import { useEffect, useRef, useState } from "react";
import Card from "../../components/card/Card";
import Filter from "../../components/filter/Filter";
import Page from "../../components/page/Page";
import { listData } from "../../lib/dummydata";
import {
  getAllRealEstatesLocationByLocationNameListAPI,
  getAllRealEstatesLocationFromBoundingBoxListAPI,
  getComuneByIdAPI,
  getRealEstateDataByLocationNameAPI,
  getRealEstatesFromBoundingBoxListAPI,
} from "../../utils/searchAPI";
import { scrollToToTopWithElemRef } from "../../utils/utils";
import "./listPage.scss";
import Map from "../../components/map/Map";
import ComuneInfo from "../../components/info_prezzo_comune/ComuneInfo";
// import { useSearchParams } from "react-router-dom";

function ListPage() {
  const wrapperRef = useRef(null);
  const [isMapSearch, setIsMapSearch] = useState(false);

  const [data, setData] = useState(listData);
  const [allRealStatesData, setAllRealStatesData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchIcon, setSearchIcon] = useState(false);
  const [currentCityDisplayed, setCurrentCityDisplayed] = useState(null);
  const [comuneInfo, setComuneInfo] = useState("");

  // poi icon animation on mouseOver
  const [poiIconAnimation, setPoiIconAnimation] = useState({});
  const handlePoiMouseOver = (index, state) => {
    // remove the class to all the markers

    // add the animation class to the selected items

    setPoiIconAnimation({ index: index, state: state });
  };

  const [filterOptions, setFilterOptions] = useState({
    macroarea: "",
    microarea: "",
    orderBy: "Consigliati",
    city: "", // locazione
    cityId: -1,
    type: "", // affitto, vendita, asta
    property: "", // tipo di costruzione
    isNew: "", // costruzione nuova o meno
    price: {
      min: 0,
      max: 0,
    },
    rooms: "", // numero stanze da letto o numero locali ?
    autore: "", // privato o agenzia ?
    date: {
      // data dell'annuncio
      from: "",
      to: "",
    },
    mq: {
      // metri quadri
      from: 0,
      to: 0,
    },
    mqPrice: {
      // metri quadri
      from: 0,
      to: 0,
    },
  });

  // leaflet bounding box coordinates
  const [boundingBox, setBoundingBox] = useState(null);

  const handleSetData = (newData) => {
    setData(newData);
  };

  const handleSetTotalPages = (total) => {
    setTotalPages(total);
  };

  const handleSetPageNumber = (pageNumber) => {
    setPage(pageNumber);
  };

  const handleSearchIcon = (searchIconStatus) => {
    setSearchIcon(searchIconStatus);
  };

  const handleIsMapSearch = (isMapSearch) => {
    setIsMapSearch(isMapSearch);
  };

  const handleSetAllRealStatesData = (newAllData) => {
    setAllRealStatesData([]);
    setAllRealStatesData(newAllData);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (searchIcon) {
        // retrive all RealEstates page items
        await fetchRealEstateDataByName();

        // retrive all locations displayed by points
        await fetchAllRealEstateLocationDataByLocationName();
        // todo: set search on map to FALSE
        // todo: add an event listener for on click outside the map ?
      }
      setSearchIcon(false);
      setIsMapSearch(false);
    };

    fetchData();
  }, [searchIcon]);

  // handle city displayed
  useEffect(() => {
    const getCityBoundaryBox = async () => {
      const response = await getComuneByIdAPI(filterOptions.cityId);
      setCurrentCityDisplayed(response);
    };

    getCityBoundaryBox();
  }, [filterOptions.cityId]);

  useEffect(() => {
    // todo: refract this use effect baseod on isMapSearch param
    const fetchDataFromSearchBar = async () => {
      await fetchRealEstateDataByName();
      // scrollToElemRef(wrapperRef); // Scroll to the wrapper element();
    };

    if (!isMapSearch) fetchDataFromSearchBar();
  }, [page]);

  useEffect(() => {
    const fetchAllRealEstateLocationDataByBoundaryBox = async () => {
      const repsonse = await getAllRealEstatesLocationFromBoundingBoxListAPI(
        boundingBox?.west,
        boundingBox?.east,
        boundingBox?.north,
        boundingBox?.south,
        filterOptions
      );
      handleSetAllRealStatesData(repsonse?.data);
    };
    const fetchDataFromMap = async () => {
      await fetchRealEstateDataByBoundaryBox();
    };

    if (isMapSearch) {
      fetchAllRealEstateLocationDataByBoundaryBox();
      fetchDataFromMap();
    }
  }, [boundingBox, page]);

  const fetchRealEstateDataByName = async () => {
    try {
      if (filterOptions.city === "") throw new Error("Please insert a city");
      const repsonse = await getRealEstateDataByLocationNameAPI(
        filterOptions.city,
        page,
        null,
        null,
        null,
        null,
        filterOptions
      );
      handleSetData(repsonse?.data);
      handleSetTotalPages(repsonse?.totalPages);
      scrollToToTopWithElemRef(wrapperRef);
    } catch (error) {
      // Gestisci gli errori qui, ad esempio mostrando un messaggio all'utente
      console.error("Errore durante il recupero dei dati:", error);
    }
  };

  const fetchRealEstateDataByBoundaryBox = async () => {
    try {
      const repsonse = await getRealEstatesFromBoundingBoxListAPI(
        page,
        boundingBox?.west,
        boundingBox?.east,
        boundingBox?.north,
        boundingBox?.south,
        filterOptions
      );
      handleSetData(repsonse?.data);
      handleSetTotalPages(repsonse?.totalPages);
      scrollToToTopWithElemRef(wrapperRef);
    } catch (error) {
      // Gestisci gli errori qui, ad esempio mostrando un messaggio all'utente
      console.error("Errore durante il recupero dei dati:", error);
    }
  }; // fetchAllRealEstateDataByLocationName

  const fetchAllRealEstateLocationDataByLocationName = async () => {
    try {
      if (filterOptions.city === "") throw new Error("Please insert a city");
      // TODO: handle isMapSearch or isSearchIcon
      const repsonse = await getAllRealEstatesLocationByLocationNameListAPI(
        filterOptions.city,
        page,
        null,
        null,
        null,
        null,
        filterOptions
      );
      handleSetAllRealStatesData(repsonse?.data);
      handleSetTotalPages(repsonse?.totalPages);
      scrollToToTopWithElemRef(wrapperRef);
    } catch (error) {
      // Gestisci gli errori qui, ad esempio mostrando un messaggio all'utente
      console.error("Errore durante il recupero dei dati:", error);
    }
  };

  // todo: add api call to show all realEstates points of the current view to see on the map as circle point
  return (
    <div className="listPage">
      <div className="listContainer">
        <div className="wrapper" ref={wrapperRef}>
          <Filter
            handleSearchIcon={handleSearchIcon}
            handleSetData={handleSetData}
            page={page}
            handleSetTotalPages={handleSetTotalPages}
            filterOptions={filterOptions}
            setFilterOptions={setFilterOptions}
            setComuneInfo={setComuneInfo}
          />
          <div className="list">
            {data &&
              Array.isArray(data) &&
              data.map((item) => (
                <Card
                  key={item._id}
                  item={item}
                  poiIconAnimation={poiIconAnimation}
                  handlePoiMouseOver={handlePoiMouseOver}
                />
              ))}
            <Page
              total={totalPages}
              handleSetPageNumber={handleSetPageNumber}
            />
          </div>
        </div>
      </div>
      <div className="mapContainer">
        <Map
          items={data}
          handleIsMapSearch={handleIsMapSearch}
          isMapSearch={isMapSearch}
          boundingBox={boundingBox}
          setBoundingBox={setBoundingBox}
          allRealStatesData={allRealStatesData}
          poiIconAnimation={poiIconAnimation}
          currentCityDisplayed={currentCityDisplayed}
          filterOptions={filterOptions}
          comuneInfo={comuneInfo}
        />
      </div>
      {filterOptions.city && <ComuneInfo comune={filterOptions.city} />}
    </div>
  );
}

export default ListPage;
