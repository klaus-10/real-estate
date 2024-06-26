import { Link } from "react-router-dom";
import "./card.scss";

function Card({ item, poiIconAnimation, handlePoiMouseOver }) {
  // use "poiIconAnimation" to animate card

  return (
    <div
      className="card"
      onMouseOver={() => {
        handlePoiMouseOver(item._id, "active");
      }}
      onMouseLeave={() => {
        handlePoiMouseOver(item._id, "none");
      }}
    >
      {/* <a to={`${item && item.seo && item.seo.url}`} className="imageContainer"> */}
      <Link
        to={`${item && item.seo && item.seo.url}`}
        target="_blank"
        rel="noopener noreferrer"
        className="imageContainer"
      >
        {/* <img src={item.realEstate.properties[0].multimedia.hasMultimedia && item.realEstate.properties[0].multimedia.photos[0].urls.small} alt="" /> */}
        {/* <img src={item.realEstate?.properties[0]?.multimedia?.hasMultimedia && item.realEstate.properties[0].multimedia.photos[0]?.urls?.small} alt="" /> */}
        <img
          src={
            item.realEstate?.properties[0]?.photos?.urls?.small ||
            item.realEstate?.properties[0]?.multimedia.photos[0]?.urls?.small
          }
          alt=""
        />
      </Link>
      <div className="textContainer">
        <h2 className="title">
          <a
            href={`${item && item.seo && item.seo.url}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {item.seo?.title}
          </a>
        </h2>
        <h6 className="description">
          {item.realEstate?.properties[0].caption}
        </h6>
        <p className="address">
          <img src="/pin.png" alt="" />
          <span>
            {item.realEstate?.properties[0].location.city} -{" "}
            {item.realEstate?.properties[0].location.macrozone}
          </span>
        </p>
        <p className="price">{item?.realEstate?.price?.formattedValue}</p>

        {/* <div className="bottom">
          <div className="features">
            <div className="feature">
              <img src="/bed.png" alt="" />
              <span>
                {item.realEstate?.properties[0]?.bedRoomsNumber} bedroom
              </span>
            </div>
            <div className="feature">
              <img src="/bath.png" alt="" />
              <span>{item.realEstate?.properties[0]?.bathrooms} bathroom</span>
            </div>
            <div className="feature">
              <img src="/bath.png" alt="" />
              <span>{item.realEstate?.properties[0]?.rooms} rooms</span>
            </div>
          </div>
        </div> */}

        <div className="bottom">
          <div className="features">
            <div className="feature">
              <img src="/bed.png" alt="" />
              <span>
                {item.realEstate?.properties[0]?.bedRoomsNumber} bedroom
              </span>
            </div>
            <div className="feature">
              <img src="/bath.png" alt="" />
              <span>{item.realEstate?.properties[0]?.bathrooms} bathroom</span>
            </div>
            <div className="feature">
              <img src="/bath.png" alt="" />
              <span>{item.realEstate?.properties[0]?.rooms} rooms</span>
            </div>
          </div>
        </div>
        <div className="bottom">
          <div className="features">
            <div className="feature">
              <img src="/bath.png" alt="" />
              <span>
                Elevator:{" "}
                {item.realEstate?.properties[0]?.elevator ? "yes" : "no"}
              </span>
            </div>
            <div className="feature">
              <img src="/bath.png" alt="" />
              <span>{item.realEstate?.properties[0]?.surface}</span>
            </div>
            <div className="feature">
              <img src="/bath.png" alt="" />
              <span>mqPrice {item.realEstate?.price?.mq_price} €</span>
            </div>
          </div>
          <div className="icons">
            <div className="icon">
              <img src="/save.png" alt="" />
            </div>
            {/* <div className="icon">
              <img src="/chat.png" alt="" />
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;
