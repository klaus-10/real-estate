import { listData } from "../../lib/dummydata";
import "./listPage.scss";
import Filter from "../../components/filter/Filter"
import Card from "../../components/card/Card"
import Map from "../../components/map/Map";
import { useEffect, useState } from "react";

function ListPage() {
  const [data, setData] = useState(listData);
  // const data = listData; // TODO: fetch from API

  const handleSetData = (data) => {
    setData(data);
  }

  useEffect(() => {
    console.log("data: ", data);
  }, [data])

  return <div className="listPage">
    <div className="listContainer">
      <div className="wrapper">
        <Filter handleSetData={handleSetData}/>
        {data && Array.isArray(data) && data.map(item=>(
          <Card key={item._id} item={item}/>
        ))}
      </div>
    </div>
    <div className="mapContainer">
      {/* <Map items={data}/> */}
    </div>
  </div>;
}

export default ListPage;
