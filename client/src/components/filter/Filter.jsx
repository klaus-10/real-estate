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

    searchParams.set("city", filterOptions.city);
    searchParams.set("type", filterOptions.type);
    searchParams.set("property", filterOptions.property);
    searchParams.set("minPrice", filterOptions.minPrice);
    searchParams.set("maxPrice", filterOptions.maxPrice);
    searchParams.set("bedroom", filterOptions.bedroom);
    searchParams.set("page", page);

    console.log(filterOptions);
  };

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
              <option value="buy">Buy</option>
              <option value="rent">Rent</option>
            </select>
          </div>
          <div className="item">
            <label htmlFor="property">Property</label>
            <select
              name="property"
              id="property"
              value={filterOptions.property}
              onChange={handleFilterChange}
            >
              <option value="">any</option>
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="condo">Condo</option>
              <option value="land">Land</option>
            </select>
          </div>
          <div className="item">
            <label htmlFor="minPrice">Min Price</label>
            <input
              type="number"
              id="minPrice"
              name="minPrice"
              placeholder="any"
              value={filterOptions.minPrice}
              onChange={handleFilterChange}
            />
          </div>
          <div className="item">
            <label htmlFor="maxPrice">Max Price</label>
            <input
              type="text"
              id="maxPrice"
              name="maxPrice"
              placeholder="any"
              value={filterOptions.maxPrice}
              onChange={handleFilterChange}
            />
          </div>
          <div className="item">
            <label htmlFor="bedroom">Bedroom</label>
            <input
              type="text"
              id="bedroom"
              name="bedroom"
              placeholder="any"
              value={filterOptions.bedroom}
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
