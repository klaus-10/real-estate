import { Marker, Popup } from "react-leaflet";
import "./pin.scss";
import { Link } from "react-router-dom";

function Pin({ item, poiIconAnimation }) {
  // console.log(
  //   "poiIconAnimation: ",
  //   poiIconAnimation,
  //   " - ",
  //   item._id,
  //   " - ",
  //   poiIconAnimation.index === item._id
  // );

  // console.log(poiIconAnimation.state === "active" ? "animate" : "");

  return (
    <>
      {item?.realEstate?.loc && (
        <Marker
          position={[
            item?.realEstate?.loc?.coordinates[1],
            item?.realEstate?.loc?.coordinates[0],
          ]}
          className={
            poiIconAnimation.index === item._id &&
            poiIconAnimation.state === "active"
              ? "animate"
              : ""
          }
        >
          <Popup>
            <div className="popupContainer">
              <img
                src={
                  item.realEstate?.properties[0]?.photos?.urls?.small ||
                  item.realEstate?.properties[0]?.multimedia.photos[0]?.urls
                    ?.small
                }
                alt=""
              />
              <div className="textContainer">
                {/* <Link to={`/${item.idGeoHash}`}>{item.title}</Link> */}
                <a
                  href={`${item && item.seo && item.seo.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.seo?.title}
                </a>
                <span>
                  {item.realEstate?.properties[0]?.bedRoomsNumber} bedroom
                </span>
                <span>
                  {item.realEstate?.properties[0]?.bathrooms} bathrooms
                </span>
                <span>{item.realEstate?.properties[0]?.rooms} rooms</span>
                <b>$ {item?.realEstate?.price?.formattedValue}</b>
              </div>
            </div>
          </Popup>
        </Marker>
      )}
    </>
  );
}

export default Pin;
