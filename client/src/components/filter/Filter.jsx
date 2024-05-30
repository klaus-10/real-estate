import React, { useEffect, useState } from "react";
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
  // Function to handle changes in filter options
  const handleFilterChange = (e) => {
    const { name, value, type } = e.target;

    // Check if the field is a nested property
    const nestedFields = [
      "price.min",
      "price.max",
      "date.from",
      "date.to",
      "mq.from",
      "mq.to",
      "mqPrice.from",
      "mqPrice.to",
    ];
    const isNested = nestedFields.includes(name);

    // Convert value to number if the input type is number and it's not a date field
    const convertedValue =
      type === "number" && !name.startsWith("date.")
        ? parseFloat(value)
        : value;

    // Update the state based on whether the field is nested or not
    if (isNested) {
      const [category, subName] = name.split(".");
      setFilterOptions((prevOptions) => ({
        ...prevOptions,
        [category]: {
          ...prevOptions[category],
          [subName]: convertedValue,
        },
      }));
    } else {
      setFilterOptions((prevOptions) => ({
        ...prevOptions,
        [name]: name === "rooms" ? value + "" : value,
      }));
    }

    console.log("filterOptions: ", filterOptions);
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (filterOptions.city === "" || filterOptions.city === null) return;
    handleSearchIcon(true);
    const data = await getRealEstateDataAPI(page, filterOptions);
    handleSetData(data?.data);
    handleSetTotalPages(data?.total);
    setCitySuggestions([]);
  };

  // handle city suggestion
  const [cityTemp, setCityTemp] = useState("");
  const handleCityTemp = (e) => setCityTemp(e.target.value);
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [isAutocomplete, setIsAutocomplete] = useState(false);
  const handleIsAutocomplete = (val) => setIsAutocomplete(val);

  useEffect(() => {
    const fetchLocations = async () => {
      // Make API call to retrieve locations
      const response = await fetch(
        `http://localhost:8080/real-estate/comuni/search/?locationName=${cityTemp}`
      );
      const data = await response.json();
      setCitySuggestions(data); // Assuming API returns an array of suggestions
    };

    const timeoutId = setTimeout(() => {
      if (cityTemp.trim() !== "") {
        fetchLocations();
      } else {
        setCitySuggestions([]);
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [cityTemp]);

  const handleCitySelection = (comune) => {
    setFilterOptions((prevOptions) => ({
      ...prevOptions,
      city: comune,
    }));
    setCityTemp(comune);
    setIsAutocomplete(false);
  };

  const handleCityIdSelection = (id) => {
    setFilterOptions((prevOptions) => ({
      ...prevOptions,
      cityId: id,
    }));
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
            {/* <input
              type="text"
              id="city"
              name="city"
              placeholder="City Location"
              value={filterOptions.city}
              onChange={(e) => {
                handleIsAutocomplete(true);
                handleFilterChange(e);
                handleCityTemp(e);
              }}
            /> */}
            <div style={{ position: "relative" }}>
              <input
                type="text"
                id="city"
                name="city"
                placeholder="City Location"
                value={filterOptions.city}
                onChange={(e) => {
                  handleIsAutocomplete(true);
                  handleFilterChange(e);
                  handleCityTemp(e);
                }}
              />
              {filterOptions.city && (
                <button
                  type="button"
                  style={{
                    position: "absolute",
                    top: "50%",
                    right: "5px",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                    backgroundColor: "transparent",
                    border: "none",
                  }}
                  onClick={(e) => {
                    // Clear logic
                    handleCitySelection("");
                    handleSubmit(e);
                  }}
                >
                  <span>x</span>
                </button>
              )}
            </div>

            {isAutocomplete && (
              <ul className="autocomplete">
                {citySuggestions.map((location) => (
                  <li
                    key={location.id}
                    onClick={() => {
                      handleCitySelection(location.name);
                      handleCityIdSelection(location._id);
                    }}
                  >
                    {location.name}
                  </li>
                ))}
              </ul>
            )}
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
              name="property"
              id="property"
              value={filterOptions.property}
              onChange={handleFilterChange}
            >
              <option value="">Tutte le tipologie</option>
              <option value="Appartamento">Appartamento</option>
              <option value="Attico">Attico</option>
              <option value="Casale">Casale</option>
              <option value="Mansarda">Mansarda</option>
              <option value="Palazzo - Edificio">Palazzo - Edificio</option>
              <option value="Rustico">Rustico</option>
              <option value="Stabile o palazzo">Stabile o palazzo</option>
              <option value="Terratetto plurifamiliare">
                Terratetto plurifamiliare
              </option>
              <option value="Terratetto unifamiliare">
                Terratetto unifamiliare
              </option>
              <option value="Villa a schiera">Villa a schiera</option>
              <option value="Villa bifamiliare">Villa bifamiliare</option>
              <option value="Villa plurifamiliare">Villa plurifamiliare</option>
              <option value="Villa unifamiliare">Villa unifamiliare</option>
            </select>
          </div>
          <div className="item">
            <label htmlFor="isNew">Nuovi appartamenti</label>
            <select
              name="isNew"
              id="isNew"
              value={filterOptions.isNew}
              onChange={handleFilterChange}
            >
              <option value="">any</option>
              <option value="1">True</option>
              <option value="0">False</option>
            </select>
          </div>
          <div className="item">
            <label htmlFor="price.min">Min Price</label>
            <input
              type="number"
              id="price.min"
              name="price.min"
              placeholder="any"
              value={filterOptions.price.min}
              onChange={handleFilterChange}
            />
          </div>
          <div className="item">
            <label htmlFor="price.max">Max Price</label>
            <input
              type="number"
              id="price.max"
              name="price.max"
              placeholder="any"
              value={filterOptions.price.max}
              onChange={handleFilterChange}
            />
          </div>
          <div className="item">
            <label htmlFor="date.from">From Date</label>
            <input
              type="date"
              id="date.from"
              name="date.from"
              placeholder="any"
              value={filterOptions.date.from}
              onChange={handleFilterChange}
            />
          </div>
          <div className="item">
            <label htmlFor="date.to">To Date</label>
            <input
              type="date"
              id="date.to"
              name="date.to"
              placeholder="any"
              value={filterOptions.date.to}
              onChange={handleFilterChange}
            />
          </div>
          <div className="item">
            <label htmlFor="mq.from">mq_from</label>
            <input
              type="number"
              id="mq.from"
              name="mq.from"
              placeholder="any"
              value={filterOptions.mq.from}
              onChange={handleFilterChange}
            />
          </div>
          <div className="item">
            <label htmlFor="mq.to">mq_to</label>
            <input
              type="number"
              id="mq.to"
              name="mq.to"
              placeholder="any"
              value={filterOptions.mq.to}
              onChange={handleFilterChange}
            />
          </div>
          <div className="item">
            <label htmlFor="mqPrice.from">mqPrice from</label>
            <input
              type="number"
              id="mqPrice.from"
              name="mqPrice.from"
              placeholder="any"
              value={filterOptions.mqPrice.from}
              onChange={handleFilterChange}
            />
          </div>
          <div className="item">
            <label htmlFor="mqPrice.to">mqPrice to</label>
            <input
              type="number"
              id="mqPrice.to"
              name="mqPrice.to"
              placeholder="any"
              value={filterOptions.mqPrice.to}
              onChange={handleFilterChange}
            />
          </div>
          <div className="item">
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
