import { useEffect, useRef, useState } from "react";
import Card from "../../components/card/Card";
import Filter from "../../components/filter/Filter";
import Page from "../../components/page/Page";
import { listData } from "../../lib/dummydata";
import {
  getRealEstateDataAPI,
  getRealEstatesFromBoundingBoxListAPI,
} from "../../utils/searchAPI";
import { scrollToToTopWithElemRef } from "../../utils/utils";
import "./listPage.scss";
import Map from "../../components/map/Map";

function ListPage() {
  const wrapperRef = useRef(null);
  const [isMapSearch, setIsMapSearch] = useState(false);

  const [data, setData] = useState(listData);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchIcon, setSearchIcon] = useState(false);

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
        // todo: replace this call with more selected query based on city/region/quarter
        await fetchRealEstateData();
        // todo: set search on map to FALSE
        // todo: add an event listener for on click outside the map ?
      }
      setSearchIcon(false);
    };

    fetchData();
  }, [searchIcon]);

  useEffect(() => {
    // todo: refract this use effect baseod on isMapSearch param

    const fetchDataFromSearchBar = async () => {
      await fetchRealEstateData();
      // scrollToElemRef(wrapperRef); // Scroll to the wrapper element();
    };

    const fetchDataFromMap = async () => {
      await fetchRealEstateDataByBoundaryBox();
      // scrollToElemRef(wrapperRef); // Scroll to the wrapper element();
    };

    if (!isMapSearch) fetchDataFromSearchBar();
    else fetchDataFromMap();
  }, [page]);

  const fetchRealEstateData = async () => {
    try {
      console.log("Normal Data");
      const repsonse = await getRealEstateDataAPI(page);
      console.log("repsonse: ", repsonse);
      handleSetData(repsonse?.data);
      handleSetTotalPages(repsonse?.total);
      scrollToToTopWithElemRef(wrapperRef);
    } catch (error) {
      // Gestisci gli errori qui, ad esempio mostrando un messaggio all'utente
      console.error("Errore durante il recupero dei dati:", error);
    }
  };

  const fetchRealEstateDataByBoundaryBox = async () => {
    try {
      console.log("BoundaryBox Data");
      const repsonse = await getRealEstatesFromBoundingBoxListAPI(page);
      console.log("repsonse: ", repsonse);
      handleSetData(repsonse?.data);
      handleSetTotalPages(repsonse?.total);
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
        />
      </div>
    </div>
  );
}

export default ListPage;
