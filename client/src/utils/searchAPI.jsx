import axios from "axios";

/**
 * Retrieves real estate data from the specified API endpoint.
 *
 * @return {Promise<void>} A promise that resolves when the data is successfully retrieved, or rejects with an error if there was a problem.
 */
export const getRealEstateDataAPI = async (page) => {
  try {
    const response = await axios.get("http://localhost:8080/real-estate/list", {
      params: { page: page },
    });
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

    const response = await axios.post(
      "http://localhost:8080/real-estate/boundingBox",
      body,
      { params: { page: page } }
    );
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

    const response = await axios.post(
      "http://localhost:8080/real-estate/locationsByBoundingBox",
      body,
      { params: { page: page } }
    );
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
    const response = await axios.post(
      "http://localhost:8080/real-estate/locationsByName",
      body,
      { params: { locationName: locationName, page: page } }
    );
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
    const response = await axios.post(
      "http://localhost:8080/real-estate/byName",
      body,
      { params: { locationName: locationName, page: page } }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching real estate data:", error);
  }
};

export const getComuneByIdAPI = async (id) => {
  try {
    const response = await axios.get(
      `http://localhost:8080/real-estate/comuni/search/${id}`
    );
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
    return response.data;
  } catch (error) {
    console.error("Error fetching macroarea:", error);
  }
};
