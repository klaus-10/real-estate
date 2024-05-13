import { useEffect, useRef, useState } from "react";
import Card from "../../components/card/Card";
import Filter from "../../components/filter/Filter";
import Page from "../../components/page/Page";
import { listData } from "../../lib/dummydata";
import { getRealEstateDataAPI } from "../../utils/searchAPI";
import {
  scrollToToTopWithElemRef
} from "../../utils/utils";
import "./listPage.scss";
import Map from "../../components/map/Map";

function ListPage() {
  const wrapperRef = useRef(null);
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

  useEffect(() => {
    console.log("data: ", data);
  }, [data]);

  useEffect(() => {
    const fetchData = async () => {
      console.log("pageNum INT");
      if (searchIcon) {
        await fetchRealEstateData();
      }
      setSearchIcon(false);
    };

    fetchData();
  }, [searchIcon]);

  useEffect(() => {
    const fetchData = async () => {
      console.log("pageNum INT2");
      await fetchRealEstateData();
      // scrollToElemRef(wrapperRef); // Scroll to the wrapper element();
    };

    fetchData();
  }, [page]);

  const fetchRealEstateData = async () => {
    try {
      console.log("Wrapper ref: ", wrapperRef.current);
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

  return (
    <div className="listPage">
      <div className="listContainer">
        <div
          className="wrapper"
          ref={wrapperRef}
          onScroll={(event) =>
            console.log("scrolled: ", event.target.scrollTop)
          }
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
      <div className="mapContainer"><Map items={data}/></div>
    </div>
  );
}

export default ListPage;
