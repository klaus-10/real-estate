import { useEffect, useRef, useState } from "react";
import Card from "../../components/card/Card";
import Filter from "../../components/filter/Filter";
import Page from "../../components/page/Page";
import { listData } from "../../lib/dummydata";
import {
  getAllRealEstatesLocationByLocationNameListAPI,
  getAllRealEstatesLocationFromBoundingBoxListAPI,
  getRealEstateDataByLocationNameAPI,
  getRealEstatesFromBoundingBoxListAPI,
} from "../../utils/searchAPI";
import { scrollToToTopWithElemRef } from "../../utils/utils";
import "./listPage.scss";
import Map from "../../components/map/Map";
// import { useSearchParams } from "react-router-dom";

function ListPage() {
  const wrapperRef = useRef(null);
  const [isMapSearch, setIsMapSearch] = useState(false);

  const [data, setData] = useState(listData);
  const [allRealStatesData, setAllRealStatesData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchIcon, setSearchIcon] = useState(false);

  // // Definisci lo stato iniziale dell'oggetto per salvare le scelte dell'utente
  // const [filterOptions, setFilterOptions] = useState({
  //   city: "",
  //   type: "",
  //   property: "",
  //   minPrice: "",
  //   maxPrice: "",
  //   bedroom: "",
  // });
  const [filterOptions, setFilterOptions] = useState({
    city: "", // locazione
    type: "", // affitto, vendita, asta
    property: "", // tipo di costruzione
    isNew: "", // costruzione nuova o meno
    price: {
      min: 0,
      max: 0,
    },
    rooms: 0, // numero stanze da letto o numero locali ?
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

  useEffect(() => {
    console.log("data: ", data);
  });

  const handleSetData = (newData) => {
    setData(newData);
  };

  const handleSetTotalPages = (total) => {
    setTotalPages(total);
  };

  const handleSetPageNumber = (pageNumber) => {
    setPage(pageNumber);
    console.log("pageNum: ", pageNumber);
  };

  const handleSearchIcon = (searchIconStatus) => {
    setSearchIcon(searchIconStatus);
  };

  const handleIsMapSearch = (isMapSearch) => {
    setIsMapSearch(isMapSearch);
  };

  const handleSetAllRealStatesData = (newAllData) => {
    console.log("newAllData: ", newAllData);
    setAllRealStatesData([]);
    setAllRealStatesData(newAllData);
  };

  useEffect(() => {
    console.log("data: ", data);

    console.log("isMapSearch: ", isMapSearch);
    console.log("searchIcon: ", searchIcon);
    console.log("page: ", page);
    console.log("totalPages: ", totalPages);
  }, [searchIcon]);

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
      console.log("ok");

      handleSetAllRealStatesData(repsonse?.data);
      // scrollToElemRef(wrapperRef); // Scroll to the wrapper element();
    };
    const fetchDataFromMap = async () => {
      await fetchRealEstateDataByBoundaryBox();
      // scrollToElemRef(wrapperRef); // Scroll to the wrapper element();
    };

    if (isMapSearch) {
      fetchAllRealEstateLocationDataByBoundaryBox();
      fetchDataFromMap();
    }
  }, [boundingBox, page]);

  const fetchRealEstateDataByName = async () => {
    try {
      if (filterOptions.city === "") throw new Error("Please insert a city");
      console.log("page: ", page);
      const repsonse = await getRealEstateDataByLocationNameAPI(
        filterOptions.city,
        page,
        null,
        null,
        null,
        null,
        filterOptions
      );
      console.log("repsonse-fetchRealEstateDataByName: ", repsonse);
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
      console.log("BoundaryBox Data");
      const repsonse = await getRealEstatesFromBoundingBoxListAPI(
        page,
        boundingBox?.west,
        boundingBox?.east,
        boundingBox?.north,
        boundingBox?.south,
        filterOptions
      );
      console.log("repsonse: ", repsonse);
      handleSetData(repsonse?.data);
      handleSetTotalPages(repsonse?.totalPages);
      scrollToToTopWithElemRef(wrapperRef);
    } catch (error) {
      // Gestisci gli errori qui, ad esempio mostrando un messaggio all'utente
      console.error("Errore durante il recupero dei dati:", error);
    }
  }; // fetchAllRealEstateDataByLocationName

  // const fetchAllRealEstateDataByBoundaryBox = async () => {
  //   try {
  //     console.log("BoundaryBox Data");
  //     // TODO: handle isMapSearch or isSearchIcon
  //     const repsonse = await getAllRealEstatesLocationFromBoundingBoxListAPI(
  //       page,
  //       boundingBox?.west,
  //       boundingBox?.east,
  //       boundingBox?.north,
  //       boundingBox?.south
  //     );
  //     console.log("repsonse fetchAllRealEstateDataByBoundaryBox: ", repsonse);
  //     handleSetData(repsonse?.data);
  //     handleSetTotalPages(repsonse?.totalPages);
  //     scrollToToTopWithElemRef(wrapperRef);
  //   } catch (error) {
  //     // Gestisci gli errori qui, ad esempio mostrando un messaggio all'utente
  //     console.error("Errore durante il recupero dei dati:", error);
  //   }
  // };

  const fetchAllRealEstateLocationDataByLocationName = async () => {
    try {
      if (filterOptions.city === "") throw new Error("Please insert a city");
      console.log("BoundaryBox Data");
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
      console.log(
        "repsonse getAllRealEstatesLocationByLocationNameListAPI: ",
        repsonse
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
        <div
          className="wrapper"
          ref={wrapperRef}
          // onScroll={(event) =>
          //   console.log("scrolled: ", event.target.scrollTop)
          // }
        >
          <Filter
            handleSearchIcon={handleSearchIcon}
            handleSetData={handleSetData}
            page={page}
            handleSetTotalPages={handleSetTotalPages}
            filterOptions={filterOptions}
            setFilterOptions={setFilterOptions}
          />
          <div className="list">
            {data &&
              Array.isArray(data) &&
              data.map((item) => <Card key={item._id} item={item} />)}
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
        />
      </div>
    </div>
  );
}

export default ListPage;
