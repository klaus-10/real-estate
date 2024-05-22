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
  south
) => {
  try {
    const body = { west, east, north, south };

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
  south
) => {
  try {
    const body = { west, east, north, south };
    const page = 1;
    console.log(
      "url: ",
      "http://localhost:8080/real-estate/boundingBox",
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
  south
) => {
  try {
    console.log(
      "request_url: ",
      "http://localhost:8080/real-estate/locationsByName",
      " params: ",
      { page: page, locationName: locationName }
    );
    const response = await axios.get(
      "http://localhost:8080/real-estate/locationsByName",
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
  south
) => {
  try {
    console.log(
      "request_url: ",
      "http://localhost:8080/real-estate/byName",
      " params: ",
      { page: page, locationName: locationName }
    );
    const response = await axios.get(
      "http://localhost:8080/real-estate/byName",
      { params: { locationName: locationName, page: page } }
    );
    console.log("Location - ByLocationName: ", response);
    return response.data;
  } catch (error) {
    console.error("Error fetching real estate data:", error);
    // throw error; // Rethrow the error to be handled elsewhere if needed
  }
};
