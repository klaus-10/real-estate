import React, { useState } from "react";
import "./filter.scss";
import { getRealEstateDataAPI } from "../../utils/searchAPI";

function Filter({
  handleSetData,
  page,
  handleSetTotalPages,
  handleSearchIcon,
  filterOptions,
  setFilterOptions,
}) {
  // Funzione per gestire i cambiamenti nelle opzioni di filtro
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    // Aggiorna lo stato con la nuova scelta
    setFilterOptions({
      ...filterOptions,
      [name]: value,
    });

    // searchParams.set("city", filterOptions.city);
    // searchParams.set("type", filterOptions.type);
    // searchParams.set("property", filterOptions.property);
    // searchParams.set("minPrice", filterOptions.minPrice);
    // searchParams.set("maxPrice", filterOptions.maxPrice);
    // searchParams.set("bedroom", filterOptions.bedroom);
    // searchParams.set("page", page);

    console.log("filterOptions: ", filterOptions);
  };

  console.log("filterOptions: ", filterOptions);

  // Funzione per gestire la sottomissione del filtro
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Puoi fare qualcosa con le opzioni di filtro qui, ad esempio inviarle al backend per ottenere i risultati corrispondenti
    // TODO: Api call to fetch data
    // make axios api request
    handleSearchIcon(true);
    // return;
    // const data = await getRealEstateDataAPI(page);
    // handleSetData(data?.data);
    // handleSetTotalPages(data?.total);

    // console.log(filterOptions);
  };

  return (
    <div className="filter">
      <h1>
        Search results for <b>London</b>
      </h1>
      <form onSubmit={handleSubmit}>
        <div className="top">
          <div className="item">
            <label htmlFor="city">Location</label>
            <input
              type="text"
              id="city"
              name="city"
              placeholder="City Location"
              value={filterOptions.city}
              onChange={handleFilterChange}
            />
          </div>
        </div>
        <div className="bottom">
          <div className="item">
            <label htmlFor="type">Type</label>
            <select
              name="type"
              id="type"
              value={filterOptions.type}
              onChange={handleFilterChange}
            >
              <option value="">any</option>
              <option value="ad">Buy</option>
              <option value="auction">Auction</option>
            </select>
          </div>
          <div className="item">
            <label htmlFor="property">Property</label>
            <select
              name="property" // case-appartaemnti // property
              id="property"
              value={filterOptions.property}
              onChange={handleFilterChange}
            >
              <option value="">Tutte le tipologie</option>
              <option value="apartment">Appartamento</option>
              <option value="house">Attico</option>
              <option value="condo">Casa indipendente</option>
              <option value="land">Loft</option>
              <option value="land">Rustico - Casale</option>
              <option value="land">Villa</option>
              <option value="land">Villetta a schiera</option>
            </select>
          </div>
          <div className="item">
            <label htmlFor="property">Property-type</label>
            <select
              name="property_type" // case-appartaemnti // property
              id="property_type"
              value={filterOptions.isNew}
              onChange={handleFilterChange}
            >
              <option value="">any</option>
              <option value="1">True</option>
              <option value="0">False</option>
            </select>
          </div>
          <div className="item">
            <label htmlFor="minPrice">Min Price</label>
            <input
              type="number"
              id="minPrice"
              name="minPrice"
              placeholder="any"
              value={filterOptions.price.minPrice}
              onChange={handleFilterChange}
            />
          </div>
          <div className="item">
            <label htmlFor="maxPrice">Max Price</label>
            <input
              type="number"
              id="maxPrice"
              name="maxPrice"
              placeholder="any"
              value={filterOptions.price.maxPrice}
              onChange={handleFilterChange}
            />
          </div>
          <div className="item">
            <label htmlFor="fromDate">From Date</label>
            <input
              type="date"
              id="fromDate"
              name="fromDate"
              placeholder="any"
              value={filterOptions.date.from}
              onChange={handleFilterChange}
            />
          </div>
          <div className="item">
            <label htmlFor="toDate">To Date</label>
            <input
              type="date"
              id="toDate"
              name="toDate"
              placeholder="any"
              value={filterOptions.date.to}
              onChange={handleFilterChange}
            />
          </div>

          <div className="item">
            <label htmlFor="mq_from">mq_from</label>
            <input
              type="number"
              id="mq_from"
              name="mq_from"
              placeholder="any"
              value={filterOptions.mq.from}
              onChange={handleFilterChange}
            />
          </div>
          <div className="item">
            <label htmlFor="mq_to">mq_to</label>
            <input
              type="number"
              id="mq_to"
              name="mq_to"
              placeholder="any"
              value={filterOptions.mq.to}
              onChange={handleFilterChange}
            />
          </div>

          <div className="item">
            <label htmlFor="mq_price_from">mq_price_from</label>
            <input
              type="number"
              id="mq_price_from"
              name="mq_price_from"
              placeholder="any"
              value={filterOptions.mqPrice.from}
              onChange={handleFilterChange}
            />
          </div>
          <div className="item">
            <label htmlFor="mq_price_to">mq_price_to</label>
            <input
              type="number"
              id="mq_price_to"
              name="mq_price_to"
              placeholder="any"
              value={filterOptions.mqPrice.to}
              onChange={handleFilterChange}
            />
          </div>

          <div className="item">
            {/* //Bedroom */}
            <label htmlFor="rooms">Locali</label>
            <input
              type="number"
              id="rooms"
              name="rooms"
              placeholder="any"
              value={filterOptions.rooms}
              onChange={handleFilterChange}
            />
          </div>

          <button type="submit">
            <img src="/search.png" alt="" />
          </button>
        </div>
      </form>
    </div>
  );
}

export default Filter;
