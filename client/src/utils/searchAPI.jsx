import axios from "axios";

/**
 * Retrieves real estate data from the specified API endpoint.
 *
 * @return {Promise<void>} A promise that resolves when the data is successfully retrieved, or rejects with an error if there was a problem.
 */
export const getRealEstateDataAPI = async (page) => {
  try {
    console.log(
      "url: ",
      "http://localhost:8080/real-estate/list",
      " params: ",
      { page: page }
    );
    const response = await axios.get("http://localhost:8080/real-estate/list", {
      params: { page: page },
    });
    console.log("realEstate - default: ", response);
    return response.data;
  } catch (error) {
    console.error("Error fetching real estate data:", error);
    // throw error; // Rethrow the error to be handled elsewhere if needed
  }
};

export const getRealEstatesFromBoundingBoxListAPI = async (
  page,
  west,
  east,
  north,
  south,
  filter
) => {
  try {
    const body = { west, east, north, south, filter };

    console.log(
      "url: ",
      "http://localhost:8080/real-estate/boundingBox",
      " params: ",
      { page: page },
      "body",
      body
    );
    const response = await axios.post(
      "http://localhost:8080/real-estate/boundingBox",
      body,
      { params: { page: page } }
    );
    console.log("realEstate - ByBoundaryBox: ", response);
    return response.data;
  } catch (error) {
    console.error("Error fetching real estate data:", error);
    // throw error; // Rethrow the error to be handled elsewhere if needed
  }
};

export const getAllRealEstatesLocationFromBoundingBoxListAPI = async (
  west,
  east,
  north,
  south,
  filter
) => {
  try {
    const body = { west, east, north, south, filter };
    const page = 1;
    console.log(
      "url: ",
      "http://localhost:8080/real-estate/locationsByBoundingBox",
      " params: ",
      { page: page },
      "body",
      body
    );
    const response = await axios.post(
      "http://localhost:8080/real-estate/locationsByBoundingBox",
      body,
      { params: { page: page } }
    );
    console.log("Location - ByLocationName & ByBoundingBox: ", response);
    return response.data;
  } catch (error) {
    console.error("Error fetching real estate data:", error);
    // throw error; // Rethrow the error to be handled elsewhere if needed
  }
};

export const getAllRealEstatesLocationByLocationNameListAPI = async (
  locationName,
  page,
  west,
  east,
  north,
  south,
  filter
) => {
  try {
    const body = { west, east, north, south, filter };
    console.log(
      "request_url: ",
      "http://localhost:8080/real-estate/locationsByName",
      " params: ",
      body,
      { page: page, locationName: locationName }
    );
    const response = await axios.post(
      "http://localhost:8080/real-estate/locationsByName",
      body,
      { params: { locationName: locationName, page: page } }
    );
    console.log("Location - ByLocationName: ", response);
    return response.data;
  } catch (error) {
    console.error("Error fetching real estate data:", error);
    // throw error; // Rethrow the error to be handled elsewhere if needed
  }
};

// getRealEstateDataByLocationNameAPI
export const getRealEstateDataByLocationNameAPI = async (
  locationName,
  page,
  west,
  east,
  north,
  south,
  filter
) => {
  try {
    const body = { west, east, north, south, filter };
    console.log(
      "request_url: ",
      "http://localhost:8080/real-estate/byName",
      " body: ",
      body,
      " params: ",
      { page: page, locationName: locationName }
    );
    const response = await axios.post(
      "http://localhost:8080/real-estate/byName",
      body,
      { params: { locationName: locationName, page: page } }
    );
    console.log("Location - ByLocationName: ", response);
    return response.data;
  } catch (error) {
    console.error("Error fetching real estate data:", error);
    // throw error; // Rethrow the error to be handled elsewhere if needed
  }
};

export const getComuneByIdAPI = async (id) => {
  try {
    const response = await axios.get(
      `http://localhost:8080/real-estate/comuni/search/${id}`
    );
    console.log("comune - id: ", response);
    return response.data;
  } catch (error) {
    console.error("Error fetching comuni:", error);
    // throw error; // Rethrow the error to be handled elsewhere if needed
  }
};

export const getMacroAreaAPI = async (city) => {
  try {
    const response = await axios.get(
      "http://localhost:8080/real-estate/comuni/macroarea/",
      {
        params: { locationName: city },
      }
    );
    console.log("macroarea - city: ", response);
    return response.data;
  } catch (error) {
    console.error("Error fetching macroarea:", error);
    // throw error; // Rethrow the error to be handled elsewhere if needed
  }
};
