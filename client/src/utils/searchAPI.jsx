import axios from "axios";



/**
 * Retrieves real estate data from the specified API endpoint.
 *
 * @return {Promise<void>} A promise that resolves when the data is successfully retrieved, or rejects with an error if there was a problem.
 */
export const getRealEstateDataAPI = async (page) => {
  try {
    const response = await axios.get("http://localhost:8080/real-estate/list", { params: { page: page } });
    return response.data;
  } catch (error) {
    console.error("Error fetching real estate data:", error);
    // throw error; // Rethrow the error to be handled elsewhere if needed
  }
};

export const getRealEstatesFromBoundingBoxListAPI = async (page, west, east, north, south) => {
  try {
    const body = { west, east, north, south };
    const response = await axios.post("http://localhost:8080/real-estate/boundingBox", body, { params: { page: page } });
    return response.data;
  } catch (error) {
    console.error("Error fetching real estate data:", error);
    // throw error; // Rethrow the error to be handled elsewhere if needed
  }
};

export const getAllRealEstatesLocationFromBoundingBoxListAPI = async (page, west, east, north, south) => {
  try {
    const body = { west, east, north, south };
    const response = await axios.post("http://localhost:8080/real-estate/locationsByBoundingBox", body, { params: { page: page } });
    return response.data;
  } catch (error) {
    console.error("Error fetching real estate data:", error);
    // throw error; // Rethrow the error to be handled elsewhere if needed
  }
};

export const getAllRealEstatesLocationByLocationNameListAPI = async (page, west, east, north, south) => {
  try {
    const body = { west, east, north, south };
    const response = await axios.post("http://localhost:8080/real-estate/locationsByName", body, { params: { page: page } });
    return response.data;
  } catch (error) {
    console.error("Error fetching real estate data:", error);
    // throw error; // Rethrow the error to be handled elsewhere if needed
  }
};

